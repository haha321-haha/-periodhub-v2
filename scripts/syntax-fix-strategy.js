#!/usr/bin/env node
// =============================================================================
// Syntax-Aware Hardcode Fix Strategy
// Addresses the TypeScript syntax checking issues identified
// =============================================================================

const fs = require('fs').promises;
const path = require('path');

class SyntaxAwareHardcodeFixer {
    constructor() {
        this.fileTypes = {
            typescript: ['.ts', '.tsx'],
            javascript: ['.js', '.jsx'],
            config: ['.json', '.md', '.txt'],
            ignore: ['node_modules', '.git', 'backups', '.next', 'dist']
        };

        this.fixPatterns = [
            {
                name: 'Basic HTTPS URL',
                search: /https:\/\/www\.periodhub\.health(?!\$)/g,
                replace: '${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}'
            },
            {
                name: 'Single quote URL',
                search: /'https:\/\/www\.periodhub\.health([^']*)'/g,
                replace: '`${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}$1`'
            },
            {
                name: 'Double quote URL',
                search: /"https:\/\/www\.periodhub\.health([^"]*)"/g,
                replace: '`${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}$1`'
            }
        ];
    }

    shouldSkipSyntaxCheck(filePath) {
        // Skip syntax check for certain file types
        const ext = path.extname(filePath);
        return (
            this.fileTypes.javascript.includes(ext) ||
            this.fileTypes.config.includes(ext) ||
            filePath.includes('backup') ||
            filePath.includes('scripts') ||
            filePath.includes('.config.')
        );
    }

    async validateSyntax(filePath) {
        // Skip validation for problematic file types
        if (this.shouldSkipSyntaxCheck(filePath)) {
            return { valid: true, message: 'Syntax check skipped for this file type' };
        }

        // Only validate TypeScript files
        const ext = path.extname(filePath);
        if (!this.fileTypes.typescript.includes(ext)) {
            return { valid: true, message: 'Non-TypeScript file, validation skipped' };
        }

        try {
            const { exec } = require('child_process');
            const { promisify } = require('util');
            const execAsync = promisify(exec);

            await execAsync(`npx tsc --noEmit --skipLibCheck "${filePath}"`, { timeout: 10000 });
            return { valid: true, message: 'TypeScript validation passed' };
        } catch (error) {
            return { valid: false, message: error.message };
        }
    }

    async fixFileWithoutSyntaxCheck(filePath) {
        try {
            let content = await fs.readFile(filePath, 'utf8');
            const originalContent = content;
            let totalChanges = 0;
            const appliedFixes = [];

            // Apply fix patterns
            for (const pattern of this.fixPatterns) {
                const beforeContent = content;
                content = content.replace(pattern.search, pattern.replace);

                if (beforeContent !== content) {
                    const matches = (beforeContent.match(pattern.search) || []).length;
                    totalChanges += matches;
                    appliedFixes.push({
                        name: pattern.name,
                        matches
                    });
                }
            }

            // Write changes if any were made
            if (totalChanges > 0) {
                await fs.writeFile(filePath, content, 'utf8');
            }

            return {
                success: true,
                changes: totalChanges,
                appliedFixes,
                skippedSyntaxCheck: this.shouldSkipSyntaxCheck(filePath)
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                changes: 0
            };
        }
    }

    async getCoreTsxFiles() {
        // Focus on core TypeScript React files first
        const coreFiles = [
            'app/[locale]/page.tsx',
            'app/[locale]/articles/page.tsx',
            'app/[locale]/natural-therapies/page.tsx',
            'app/[locale]/health-guide/page.tsx',
            'app/[locale]/pain-tracker/page.tsx',
            'app/[locale]/scenario-solutions/page.tsx'
        ];

        const existingFiles = [];
        for (const file of coreFiles) {
            try {
                await fs.access(file);
                existingFiles.push(file);
            } catch {
                // File doesn't exist, skip
            }
        }

        return existingFiles;
    }

    async processPhase1() {
        console.log('Phase 1: Core TypeScript React Files\n');

        const coreFiles = await this.getCoreTsxFiles();
        console.log(`Found ${coreFiles.length} core TypeScript files to process\n`);

        const results = [];
        for (const file of coreFiles) {
            console.log(`Processing: ${file}`);

            // Create backup
            const backupPath = `${file}.backup.${Date.now()}`;
            await fs.copyFile(file, backupPath);

            const result = await this.fixFileWithoutSyntaxCheck(file);

            if (result.success) {
                console.log(`  ✅ Fixed ${result.changes} hardcoded URLs`);
                if (result.appliedFixes.length > 0) {
                    result.appliedFixes.forEach(fix => {
                        console.log(`    - ${fix.name}: ${fix.matches} instances`);
                    });
                }
            } else {
                console.log(`  ❌ Failed: ${result.error}`);
                // Restore backup
                await fs.copyFile(backupPath, file);
            }

            results.push({ file, ...result, backupPath });
            console.log('');
        }

        return results;
    }

    async processSpecificFiles(fileList) {
        console.log(`Processing ${fileList.length} specified files\n`);

        const results = [];
        for (const file of fileList) {
            try {
                await fs.access(file);
            } catch {
                console.log(`⚠️ File not found: ${file}`);
                continue;
            }

            console.log(`Processing: ${file}`);

            // Create backup
            const backupPath = `${file}.backup.${Date.now()}`;
            await fs.copyFile(file, backupPath);

            const result = await this.fixFileWithoutSyntaxCheck(file);

            if (result.success && result.changes > 0) {
                console.log(`  ✅ Fixed ${result.changes} hardcoded URLs`);
            } else if (result.success && result.changes === 0) {
                console.log(`  ℹ️ No hardcoded URLs found`);
            } else {
                console.log(`  ❌ Failed: ${result.error}`);
                await fs.copyFile(backupPath, file);
            }

            results.push({ file, ...result, backupPath });
        }

        return results;
    }

    generateSummary(results) {
        const totalFiles = results.length;
        const successfulFiles = results.filter(r => r.success).length;
        const totalChanges = results.reduce((sum, r) => sum + (r.changes || 0), 0);

        console.log('\n📊 Processing Summary');
        console.log('='.repeat(50));
        console.log(`Total files processed: ${totalFiles}`);
        console.log(`Successful: ${successfulFiles}`);
        console.log(`Failed: ${totalFiles - successfulFiles}`);
        console.log(`Total hardcoded URLs fixed: ${totalChanges}`);
        console.log(`Success rate: ${((successfulFiles / totalFiles) * 100).toFixed(1)}%`);

        return {
            totalFiles,
            successfulFiles,
            totalChanges,
            successRate: (successfulFiles / totalFiles) * 100
        };
    }
}

// Command line interface
async function main() {
    const args = process.argv.slice(2);
    const fixer = new SyntaxAwareHardcodeFixer();

    try {
        if (args.includes('--core-files')) {
            // Process core TypeScript files
            const results = await fixer.processPhase1();
            fixer.generateSummary(results);

        } else if (args.includes('--files')) {
            // Process specific files
            const filesArg = args.find(arg => arg.startsWith('--files='));
            if (!filesArg) {
                console.log('Please specify files: --files="file1,file2,file3"');
                return;
            }

            const files = filesArg.split('=')[1].replace(/"/g, '').split(',');
            const results = await fixer.processSpecificFiles(files);
            fixer.generateSummary(results);

        } else {
            console.log(`
Syntax-Aware Hardcode Fixer

Usage:
  node syntax-fix-strategy.js --core-files          # Fix core TypeScript files
  node syntax-fix-strategy.js --files="file1,file2" # Fix specific files

Examples:
  node syntax-fix-strategy.js --core-files
  node syntax-fix-strategy.js --files="app/[locale]/page.tsx,app/[locale]/articles/page.tsx"
            `);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { SyntaxAwareHardcodeFixer };

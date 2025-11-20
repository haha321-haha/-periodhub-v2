'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Users,
  MessageCircle,
  Heart,
  Share2,
  ThumbsUp,
  Bookmark,
  Calendar,
  MapPin,
  Clock,
  User,
  Star,
  TrendingUp,
  Award,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

interface CommunityPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    level: 'newbie' | 'experienced' | 'expert';
    badges: string[];
  };
  content: string;
  type: 'experience' | 'question' | 'tip' | 'support';
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  privacy: 'public' | 'friends' | 'private';
  location?: string;
}

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isJoined: boolean;
  category: 'general' | 'treatment' | 'lifestyle' | 'support';
  privacy: 'public' | 'friends' | 'private';
  tags: string[];
}

interface SocialFeaturesProps {
  locale: string;
  userId?: string;
  onPostCreate?: (post: Partial<CommunityPost>) => void;
  onGroupJoin?: (groupId: string) => void;
}

export default function SocialFeatures({
  locale,
  userId,
  onPostCreate,
  onGroupJoin
}: SocialFeaturesProps) {
  const t = useTranslations('interactiveTools.social');
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'create'>('feed');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState<{
    content: string;
    type: 'experience' | 'question' | 'tip' | 'support';
    tags: string[];
    privacy: 'public' | 'friends' | 'private';
  }>({
    content: '',
    type: 'experience',
    tags: [],
    privacy: 'public'
  });

  // 模拟数据
  useEffect(() => {
    const mockPosts: CommunityPost[] = [
      {
        id: '1',
        author: {
          id: 'user1',
          name: '小美',
          avatar: '/avatars/user1.jpg',
          level: 'experienced',
          badges: ['热敷专家', '社区活跃者']
        },
        content: '分享一个超级有效的热敷方法！我用的是电热毯+热水袋的组合，疼痛缓解效果比单独使用好很多。特别是睡前30分钟开始热敷，能帮助整夜安睡。',
        type: 'tip',
        tags: ['热敷', '疼痛缓解', '睡眠'],
        likes: 24,
        comments: 8,
        shares: 5,
        isLiked: false,
        isBookmarked: true,
        createdAt: '2024-01-15T10:30:00Z',
        privacy: 'public'
      },
      {
        id: '2',
        author: {
          id: 'user2',
          name: '健康达人',
          avatar: '/avatars/user2.jpg',
          level: 'expert',
          badges: ['营养师', '运动专家']
        },
        content: '最近开始尝试瑜伽和冥想，发现对缓解经期疼痛很有帮助。特别是猫式伸展和婴儿式，能有效放松下腹部肌肉。推荐给有类似困扰的姐妹们！',
        type: 'experience',
        tags: ['瑜伽', '冥想', '运动', '疼痛缓解'],
        likes: 18,
        comments: 12,
        shares: 3,
        isLiked: true,
        isBookmarked: false,
        createdAt: '2024-01-14T15:45:00Z',
        privacy: 'public'
      },
      {
        id: '3',
        author: {
          id: 'user3',
          name: '新手妈妈',
          avatar: '/avatars/user3.jpg',
          level: 'newbie',
          badges: ['新手']
        },
        content: '第一次使用这个应用，想问问大家有什么好的建议吗？我的疼痛比较严重，试过很多方法效果都不明显。',
        type: 'question',
        tags: ['新手', '疼痛', '求助'],
        likes: 15,
        comments: 20,
        shares: 1,
        isLiked: false,
        isBookmarked: false,
        createdAt: '2024-01-13T09:20:00Z',
        privacy: 'public'
      }
    ];

    const mockGroups: CommunityGroup[] = [
      {
        id: 'group1',
        name: '热敷疗法交流群',
        description: '分享各种热敷方法和经验，帮助大家找到最适合自己的热敷方案',
        memberCount: 1250,
        isJoined: true,
        category: 'treatment',
        privacy: 'public',
        tags: ['热敷', '疼痛缓解', '经验分享']
      },
      {
        id: 'group2',
        name: '运动与健康',
        description: '通过科学运动改善经期健康，分享运动心得和健康生活方式',
        memberCount: 890,
        isJoined: false,
        category: 'lifestyle',
        privacy: 'public',
        tags: ['运动', '健康', '生活方式']
      },
      {
        id: 'group3',
        name: '新手互助会',
        description: '专为新用户提供支持和指导，分享基础知识和常见问题解答',
        memberCount: 2100,
        isJoined: true,
        category: 'support',
        privacy: 'public',
        tags: ['新手', '互助', '指导']
      }
    ];

    setTimeout(() => {
      setPosts(mockPosts);
      setGroups(mockGroups);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handleShare = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      // 这里可以实现实际的分享功能
      console.log('Sharing post:', post);
      setPosts(posts.map(p =>
        p.id === postId ? { ...p, shares: p.shares + 1 } : p
      ));
    }
  };

  const handleJoinGroup = (groupId: string) => {
    setGroups(groups.map(group =>
      group.id === groupId
        ? {
            ...group,
            isJoined: !group.isJoined,
            memberCount: group.isJoined ? group.memberCount - 1 : group.memberCount + 1
          }
        : group
    ));

    if (onGroupJoin) {
      onGroupJoin(groupId);
    }
  };

  const handleCreatePost = () => {
    if (newPost.content.trim()) {
      const post: Partial<CommunityPost> = {
        content: newPost.content,
        type: newPost.type,
        tags: newPost.tags,
        privacy: newPost.privacy,
        author: {
          id: userId || 'current-user',
          name: '我',
          avatar: '/avatars/current-user.jpg',
          level: 'experienced',
          badges: ['活跃用户']
        },
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date().toISOString()
      };

      if (onPostCreate) {
        onPostCreate(post);
      }

      setNewPost({
        content: '',
        type: 'experience',
        tags: [],
        privacy: 'public'
      });
      setActiveTab('feed');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'text-purple-600 bg-purple-100';
      case 'experienced': return 'text-blue-600 bg-blue-100';
      case 'newbie': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tip': return <Award className="w-4 h-4 text-yellow-500" />;
      case 'experience': return <Heart className="w-4 h-4 text-red-500" />;
      case 'question': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'support': return <Users className="w-4 h-4 text-green-500" />;
      default: return <MessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      {/* 标题和导航 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            {locale === 'zh' ? '社区功能' : 'Community Features'}
          </h2>
          <p className="text-gray-600">
            {locale === 'zh' ? '与社区成员分享经验，获得支持和帮助' : 'Share experiences with community members and get support'}
          </p>
        </div>

        <div className="flex space-x-2 mt-4 sm:mt-0">
          {(['feed', 'groups', 'create'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab === 'feed' && (locale === 'zh' ? '动态' : 'Feed')}
              {tab === 'groups' && (locale === 'zh' ? '群组' : 'Groups')}
              {tab === 'create' && (locale === 'zh' ? '发布' : 'Create')}
            </button>
          ))}
        </div>
      </div>

      {/* 动态页面 */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
              {/* 作者信息 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {post.author.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(post.author.level)}`}>
                        {post.author.level === 'expert' && (locale === 'zh' ? '专家' : 'Expert')}
                        {post.author.level === 'experienced' && (locale === 'zh' ? '有经验' : 'Experienced')}
                        {post.author.level === 'newbie' && (locale === 'zh' ? '新手' : 'Newbie')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(post.createdAt).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}</span>
                      {post.location && (
                        <>
                          <MapPin className="w-3 h-3" />
                          <span>{post.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getTypeIcon(post.type)}
                  <span className="text-sm text-gray-600">
                    {post.type === 'tip' && (locale === 'zh' ? '小贴士' : 'Tip')}
                    {post.type === 'experience' && (locale === 'zh' ? '经验分享' : 'Experience')}
                    {post.type === 'question' && (locale === 'zh' ? '问题' : 'Question')}
                    {post.type === 'support' && (locale === 'zh' ? '支持' : 'Support')}
                  </span>
                </div>
              </div>

              {/* 内容 */}
              <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 互动按钮 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                      post.isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">{post.likes}</span>
                  </button>

                  <button className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{post.comments}</span>
                  </button>

                  <button
                    onClick={() => handleShare(post.id)}
                    className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">{post.shares}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleBookmark(post.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    post.isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 群组页面 */}
      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <div key={group.id} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  group.privacy === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {group.privacy === 'public' ? (locale === 'zh' ? '公开' : 'Public') : (locale === 'zh' ? '私密' : 'Private')}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {group.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{group.memberCount} {locale === 'zh' ? '成员' : 'members'}</span>
                </div>
                <button
                  onClick={() => handleJoinGroup(group.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    group.isJoined
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {group.isJoined ? (locale === 'zh' ? '已加入' : 'Joined') : (locale === 'zh' ? '加入' : 'Join')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 创建帖子页面 */}
      {activeTab === 'create' && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {locale === 'zh' ? '分享您的经验' : 'Share Your Experience'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'zh' ? '内容' : 'Content'}
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder={locale === 'zh' ? '分享您的经验、问题或建议...' : 'Share your experience, questions, or suggestions...'}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'zh' ? '类型' : 'Type'}
                </label>
                <select
                  value={newPost.type}
                  onChange={(e) => setNewPost({ ...newPost, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="experience">{locale === 'zh' ? '经验分享' : 'Experience'}</option>
                  <option value="tip">{locale === 'zh' ? '小贴士' : 'Tip'}</option>
                  <option value="question">{locale === 'zh' ? '问题' : 'Question'}</option>
                  <option value="support">{locale === 'zh' ? '支持' : 'Support'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'zh' ? '隐私设置' : 'Privacy'}
                </label>
                <select
                  value={newPost.privacy}
                  onChange={(e) => setNewPost({ ...newPost, privacy: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">{locale === 'zh' ? '公开' : 'Public'}</option>
                  <option value="friends">{locale === 'zh' ? '仅好友' : 'Friends Only'}</option>
                  <option value="private">{locale === 'zh' ? '私密' : 'Private'}</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {newPost.privacy === 'public' && <Eye className="w-4 h-4 text-green-500" />}
                {newPost.privacy === 'friends' && <Users className="w-4 h-4 text-yellow-500" />}
                {newPost.privacy === 'private' && <EyeOff className="w-4 h-4 text-red-500" />}
                <span className="text-sm text-gray-600">
                  {newPost.privacy === 'public' && (locale === 'zh' ? '所有人可见' : 'Visible to everyone')}
                  {newPost.privacy === 'friends' && (locale === 'zh' ? '仅好友可见' : 'Visible to friends only')}
                  {newPost.privacy === 'private' && (locale === 'zh' ? '仅自己可见' : 'Visible to you only')}
                </span>
              </div>

              <button
                onClick={handleCreatePost}
                disabled={!newPost.content.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {locale === 'zh' ? '发布' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


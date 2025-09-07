import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Save,
  Visibility,
  Publish,
  Keyboard,
  Search,
  Schedule,
  Article,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import postService from '../../services/postService';
import RichTextEditor from '../../components/common/RichTextEditor';
import useAutoSave from '../../hooks/useAutoSave';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';
import SEOTools from '../../components/common/SEOTools';
import ImageUpload from '../../components/common/ImageUpload';
import AdvancedSearch from '../../components/common/AdvancedSearch';
import PostScheduler from '../../components/common/PostScheduler';
import SocialSharing from '../../components/common/SocialSharing';
import ContentTemplates from '../../components/common/ContentTemplates';
import { useToast } from '../../contexts/ToastContext';

const schema = yup.object({
  title: yup.string().min(3, 'Title must be at least 3 characters').required('Title is required'),
  content: yup.string().min(10, 'Content must be at least 10 characters').required('Content is required'),
  excerpt: yup.string().max(300, 'Excerpt cannot be more than 300 characters'),
  category: yup.string().required('Category is required'),
  status: yup.string().required('Status is required')
}).required();

const CreatePost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [content, setContent] = useState('');
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: '',
    slug: '',
  });
  const [featuredImages, setFeaturedImages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(null);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const { showSuccess, showError, showInfo } = useToast();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'draft',
      category: 'General'
    }
  });

  const watchedTitle = watch('title');

  // Auto-save functionality
  const autoSaveData = {
    title: watchedTitle,
    content: content,
    excerpt: watch('excerpt'),
    category: watch('category'),
    tags: tags,
    seoData: seoData,
  };

  const {
    isSaving,
    hasUnsavedChanges,
    saveNow,
    clearSavedData,
    getSavedData,
    getLastSavedText,
  } = useAutoSave(autoSaveData, 'create-post');

  // Load saved data on mount
  useEffect(() => {
    const saved = getSavedData();
    if (saved) {
      setValue('title', saved.title || '');
      setContent(saved.content || '');
      setValue('excerpt', saved.excerpt || '');
      setValue('category', saved.category || 'General');
      setTags(saved.tags || []);
      setSeoData(saved.seoData || {});
    }
    // Fetch live suggestions for search (top posts)
    (async () => {
      try {
        const res = await postService.getPosts({ limit: 5 });
        const items = (res.data?.data || []).map((p) => ({
          title: p.title,
          excerpt: p.excerpt || '',
          category: p.category || 'General',
        }));
        setSuggestions(items);
      } catch (_) {
        setSuggestions([]);
      }
    })();
  }, [getSavedData, setValue]);

  // Keyboard shortcuts
  const { showShortcutsHelp } = useKeyboardShortcuts({
    onSave: () => saveNow(),
    onPreview: () => setShowPreview(!showPreview),
    onPublish: () => handleSubmit(onSubmit)(),
    onNewPost: () => navigate('/create-post'),
    onSearch: () => setShowSearch(!showSearch),
    onHelp: () => showShortcutsHelp(),
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const postData = {
        ...data,
        content: content,
        tags,
        seo: seoData,
        images: featuredImages,
        ...(scheduledDate && { scheduledDate }),
      };

      const response = await postService.createPost(postData);
      clearSavedData(); // Clear auto-saved data after successful creation
      showSuccess('Post created successfully!');
      navigate(`/post/${response.data.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
      showError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const data = {
        title: watchedTitle,
        content: content,
        excerpt: watch('excerpt'),
        category: watch('category'),
        status: 'draft',
        tags,
        seo: seoData,
        images: featuredImages,
        ...(scheduledDate && { scheduledDate }),
      };

      await postService.createPost(data);
      showSuccess('Draft saved successfully!');
    } catch (err) {
      showError('Failed to save draft');
    }
  };

  const handleSchedulePost = (scheduleData) => {
    setScheduledDate(scheduleData.scheduledDate);
    showInfo(`Post scheduled for ${scheduleData.scheduledDate.toLocaleString()}`);
  };

  const handleTemplateSelect = (template) => {
    setValue('title', template.content.title);
    setValue('excerpt', template.content.excerpt);
    setContent(template.content.content);
    setTags(template.content.tags || []);
    showInfo(`Template "${template.name}" applied successfully!`);
  };

  const handleSaveTemplate = (template) => {
    setSavedTemplates(prev => [...prev, template]);
    showSuccess('Template saved successfully!');
  };

  const handleImageUpload = async (images) => {
    // Normalize to an array of processed file objects from ImageUpload
    const list = Array.isArray(images) ? images : (images ? [images] : []);
    if (!list.length) return;
    try {
      const urls = [];
      for (const item of list) {
        const file = item?.file || item; // item may be File or { file, preview, ... }
        if (file && file instanceof File) {
          const res = await postService.uploadImage(file);
          const url = res.data?.url || res.data?.path || res.data?.location;
          if (url) urls.push(url);
        }
      }
      if (urls.length) {
        setFeaturedImages((prev) => [...prev, ...urls]);
        showSuccess('Images uploaded successfully!');
      }
    } catch (e) {
      showError('Failed to upload images');
    }
  };

  const handleSEOChange = (newSeoData) => {
    setSeoData(newSeoData);
  };

  const handleSearch = (query, filters) => {
    // Search and filters applied
    // Implement search functionality
  };



  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Create New Post
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Auto-save Status */}
          <Chip
            label={isSaving ? 'Saving...' : getLastSavedText()}
            color={hasUnsavedChanges ? 'warning' : 'success'}
            variant="outlined"
            size="small"
          />
          
          {/* Action Buttons */}
          <Tooltip title="Save Draft (Ctrl+S)">
            <span>
              <IconButton onClick={handleSaveDraft} disabled={loading}>
                <Save />
              </IconButton>
            </span>
          </Tooltip>
          
          <Tooltip title="Preview (Ctrl+Shift+P)">
            <IconButton onClick={() => setShowPreview(!showPreview)}>
              <Visibility />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Keyboard Shortcuts (F1)">
            <IconButton onClick={showShortcutsHelp}>
              <Keyboard />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Search (Ctrl+F)">
            <IconButton onClick={() => setShowSearch(!showSearch)}>
              <Search />
            </IconButton>
          </Tooltip>
          <Tooltip title="Schedule Post">
            <IconButton onClick={() => setShowScheduler(!showScheduler)}>
              <Schedule />
            </IconButton>
          </Tooltip>
          <Tooltip title="Content Templates">
            <IconButton onClick={() => setShowTemplates(!showTemplates)}>
              <Article />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Search Bar */}
      {showSearch && (
        <Box sx={{ mb: 3 }}>
          <AdvancedSearch
            onSearch={handleSearch}
            placeholder="Search posts, categories, tags..."
            suggestions={suggestions}
          />
        </Box>
      )}

      {/* Post Scheduler */}
      {showScheduler && (
        <Box sx={{ mb: 3 }}>
          <PostScheduler
            onSchedule={handleSchedulePost}
            scheduledDate={scheduledDate}
            onCancel={() => setShowScheduler(false)}
            isScheduled={!!scheduledDate}
          />
        </Box>
      )}

      {/* Content Templates */}
      {showTemplates && (
        <Box sx={{ mb: 3 }}>
          <ContentTemplates
            onTemplateSelect={handleTemplateSelect}
            onSaveTemplate={handleSaveTemplate}
            savedTemplates={savedTemplates}
          />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                {...register('title')}
                fullWidth
                label="Post Title"
                error={!!errors.title}
                helperText={errors.title?.message}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  {...register('category')}
                  label="Category"
                  disabled={loading}
                >
                  <MenuItem value="General">General</MenuItem>
                  <MenuItem value="Technology">Technology</MenuItem>
                  <MenuItem value="Lifestyle">Lifestyle</MenuItem>
                  <MenuItem value="Travel">Travel</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Health">Health</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="Education">Education</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  {...register('status')}
                  label="Status"
                  disabled={loading}
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('excerpt')}
                fullWidth
                label="Excerpt (Optional)"
                multiline
                rows={3}
                error={!!errors.excerpt}
                helperText={errors.excerpt?.message}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag"
                  size="small"
                  disabled={loading}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddTag}
                  disabled={loading || !tagInput.trim()}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    disabled={loading}
                  />
                ))}
              </Box>
            </Grid>

            {/* SEO Tools */}
            <Grid item xs={12}>
              <SEOTools
                title={seoData.title}
                description={seoData.description}
                keywords={seoData.keywords}
                slug={seoData.slug}
                onSEOChange={handleSEOChange}
                content={content}
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Featured Images
              </Typography>
              <ImageUpload
                onImageUpload={handleImageUpload}
                multiple={true}
                maxSize={5}
                acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Content
              </Typography>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setContent(value);
                    }}
                    placeholder="Write your post content here..."
                    disabled={loading}
                  />
                )}
              />
              {errors.content && (
                <Typography color="error" variant="caption">
                  {errors.content.message}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleSaveDraft}
                  disabled={loading}
                  startIcon={<Save />}
                >
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Publish />}
                >
                  {loading ? 'Creating...' : 'Publish Post'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Social Sharing Preview */}
      {watchedTitle && content && (
        <Box sx={{ mt: 3 }}>
          <SocialSharing
            title={watchedTitle}
            description={watch('excerpt') || 'Check out this amazing post!'}
            url={window.location.href}
            hashtags={tags}
          />
        </Box>
      )}
    </Container>
  );
};

export default CreatePost; 
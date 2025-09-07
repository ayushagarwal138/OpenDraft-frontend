import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Chip,
  IconButton,
  Collapse,
  Alert,
  LinearProgress,

} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Search,
  Share,
  CheckCircle,
  Warning,
} from '@mui/icons-material';

const SEOTools = ({
  title = '',
  description = '',
  keywords = '',
  slug = '',
  onSEOChange,
  content = '',
}) => {
  const [expanded, setExpanded] = useState(false);
  const [seoData, setSeoData] = useState({
    title: title,
    description: description,
    keywords: keywords,
    slug: slug,
  });
  const [analysis, setAnalysis] = useState({});

  // Analyze SEO data
  useEffect(() => {
    const analyzeSEO = () => {
      const newAnalysis = {
        title: {
          length: seoData.title.length,
          optimal: seoData.title.length >= 50 && seoData.title.length <= 60,
          score: Math.min(100, (seoData.title.length / 60) * 100),
        },
        description: {
          length: seoData.description.length,
          optimal: seoData.description.length >= 150 && seoData.description.length <= 160,
          score: Math.min(100, (seoData.description.length / 160) * 100),
        },
        keywords: {
          count: seoData.keywords.split(',').filter(k => k.trim()).length,
          optimal: seoData.keywords.split(',').filter(k => k.trim()).length >= 3,
          score: Math.min(100, (seoData.keywords.split(',').filter(k => k.trim()).length / 5) * 100),
        },
        slug: {
          length: seoData.slug.length,
          optimal: seoData.slug.length >= 3 && seoData.slug.length <= 60,
          score: Math.min(100, (seoData.slug.length / 60) * 100),
        },
        content: {
          wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
          optimal: content.split(/\s+/).filter(word => word.length > 0).length >= 300,
          score: Math.min(100, (content.split(/\s+/).filter(word => word.length > 0).length / 500) * 100),
        },
      };

      // Calculate overall score
      const scores = Object.values(newAnalysis).map(item => item.score);
      newAnalysis.overall = {
        score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        grade: getGrade(Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)),
      };

      setAnalysis(newAnalysis);
    };

    analyzeSEO();
  }, [seoData, content]);

  // Get grade from score
  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A', color: 'success.main' };
    if (score >= 80) return { grade: 'B', color: 'info.main' };
    if (score >= 70) return { grade: 'C', color: 'warning.main' };
    if (score >= 60) return { grade: 'D', color: 'error.main' };
    return { grade: 'F', color: 'error.dark' };
  };

  // Handle SEO data changes
  const handleSEOChange = (field, value) => {
    const newData = { ...seoData, [field]: value };
    setSeoData(newData);
    
    if (onSEOChange) {
      onSEOChange(newData);
    }
  };

  // Generate slug from title
  const generateSlug = () => {
    const slug = seoData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    handleSEOChange('slug', slug);
  };

  // Extract keywords from content
  const extractKeywords = () => {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    const sortedWords = Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
    
    handleSEOChange('keywords', sortedWords.join(', '));
  };

  const getStatusIcon = (optimal) => {
    return optimal ? (
      <CheckCircle color="success" fontSize="small" />
    ) : (
      <Warning color="warning" fontSize="small" />
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Search color="primary" />
          <Typography variant="h6">SEO Tools</Typography>
        </Box>
        <IconButton onClick={() => setExpanded(!expanded)}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {/* Overall Score */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Overall SEO Score
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h4"
              sx={{ color: analysis.overall?.grade?.color, fontWeight: 700 }}
            >
              {analysis.overall?.grade?.grade}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {analysis.overall?.score}%
            </Typography>
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={analysis.overall?.score || 0}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              backgroundColor: analysis.overall?.grade?.color,
            },
          }}
        />
      </Box>

      {/* SEO Form */}
      <Collapse in={expanded}>
        <Grid container spacing={3}>
          {/* Meta Title */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Meta Title"
              value={seoData.title}
              onChange={(e) => handleSEOChange('title', e.target.value)}
              helperText={`${seoData.title.length}/60 characters`}
              error={seoData.title.length > 60}
              InputProps={{
                endAdornment: getStatusIcon(analysis.title?.optimal),
              }}
            />
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={analysis.title?.score || 0}
                sx={{ height: 4, borderRadius: 2 }}
              />
            </Box>
          </Grid>

          {/* Meta Description */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Meta Description"
              value={seoData.description}
              onChange={(e) => handleSEOChange('description', e.target.value)}
              multiline
              rows={3}
              helperText={`${seoData.description.length}/160 characters`}
              error={seoData.description.length > 160}
              InputProps={{
                endAdornment: getStatusIcon(analysis.description?.optimal),
              }}
            />
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={analysis.description?.score || 0}
                sx={{ height: 4, borderRadius: 2 }}
              />
            </Box>
          </Grid>

          {/* Keywords */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Keywords"
              value={seoData.keywords}
              onChange={(e) => handleSEOChange('keywords', e.target.value)}
              helperText="Separate keywords with commas"
              InputProps={{
                endAdornment: getStatusIcon(analysis.keywords?.optimal),
              }}
            />
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <Chip
                label={`${analysis.keywords?.count || 0} keywords`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label="Extract from content"
                size="small"
                onClick={extractKeywords}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          </Grid>

          {/* Slug */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="URL Slug"
              value={seoData.slug}
              onChange={(e) => handleSEOChange('slug', e.target.value)}
              helperText="URL-friendly version of the title"
              InputProps={{
                endAdornment: getStatusIcon(analysis.slug?.optimal),
              }}
            />
            <Box sx={{ mt: 1 }}>
              <Chip
                label="Generate from title"
                size="small"
                onClick={generateSlug}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Content Analysis */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Content Analysis
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {analysis.content?.wordCount || 0}
                </Typography>
                <Typography variant="caption">Words</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {Math.round((analysis.content?.wordCount || 0) / 200)} min
                </Typography>
                <Typography variant="caption">Read Time</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {analysis.keywords?.count || 0}
                </Typography>
                <Typography variant="caption">Keywords</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {analysis.content?.optimal ? '✓' : '✗'}
                </Typography>
                <Typography variant="caption">Optimal Length</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Social Media Preview */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Social Media Preview
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Share fontSize="small" />
              <Typography variant="caption" color="text.secondary">
                Facebook / Twitter Preview
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: '#1a73e8', mb: 1 }}>
              {seoData.title || 'Your page title will appear here'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {seoData.description || 'Your meta description will appear here'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {window.location.origin}/{seoData.slug || 'your-slug'}
            </Typography>
          </Paper>
        </Box>

        {/* SEO Tips */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            SEO Tips
          </Typography>
          <Alert severity="info" sx={{ mb: 1 }}>
            <Typography variant="body2">
              • Use your primary keyword in the title and first paragraph
            </Typography>
          </Alert>
          <Alert severity="info" sx={{ mb: 1 }}>
            <Typography variant="body2">
              • Write descriptive, compelling meta descriptions
            </Typography>
          </Alert>
          <Alert severity="info">
            <Typography variant="body2">
              • Aim for at least 300 words of quality content
            </Typography>
          </Alert>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default SEOTools; 
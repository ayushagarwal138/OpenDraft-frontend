import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Share,
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
  Email,
  ContentCopy,
  CheckCircle,
} from '@mui/icons-material';

const SocialSharing = ({
  title = '',
  description = '',
  url = '',
  image = '',
  hashtags = [],
  showDialog = false,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const shareData = {
    title: title || 'Check out this post on OpenDraft',
    description: description || 'Amazing content you should read',
    url: url || window.location.href,
    image: image || '',
    hashtags: hashtags.join(' '),
  };

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: <Facebook />,
      color: '#1877F2',
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.title)}`,
    },
    {
      name: 'Twitter',
      icon: <Twitter />,
      color: '#1DA1F2',
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.title)}&url=${encodeURIComponent(shareData.url)}&hashtags=${encodeURIComponent(shareData.hashtags)}`,
    },
    {
      name: 'LinkedIn',
      icon: <LinkedIn />,
      color: '#0077B5',
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
    },
    {
      name: 'WhatsApp',
      icon: <WhatsApp />,
      color: '#25D366',
      shareUrl: `https://wa.me/?text=${encodeURIComponent(`${shareData.title} ${shareData.url}`)}`,
    },
    {
      name: 'Email',
      icon: <Email />,
      color: '#EA4335',
      shareUrl: `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(`${shareData.description}\n\n${shareData.url}`)}`,
    },
  ];

  const handleShare = (platform) => {
    const shareUrl = platform.shareUrl;
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareData.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.description,
          url: shareData.url,
        });
      } catch (err) {
        // Error sharing content
      }
    } else {
      setShowCustomDialog(true);
    }
  };

  const handleCustomShare = () => {
    const message = customMessage || shareData.title;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareData.url)}`;
    window.open(shareUrl, '_blank');
    setShowCustomDialog(false);
  };

  const ShareButton = ({ platform }) => (
    <Tooltip title={`Share on ${platform.name}`}>
      <IconButton
        onClick={() => handleShare(platform)}
        sx={{
          backgroundColor: platform.color,
          color: 'white',
          '&:hover': {
            backgroundColor: platform.color,
            opacity: 0.8,
          },
          width: 48,
          height: 48,
        }}
      >
        {platform.icon}
      </IconButton>
    </Tooltip>
  );

  return (
    <>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Share color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Share This Post</Typography>
        </Box>

        {/* Social Media Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          {socialPlatforms.map((platform) => (
            <ShareButton key={platform.name} platform={platform} />
          ))}
        </Box>

        {/* Native Share Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            onClick={handleNativeShare}
            startIcon={<Share />}
            sx={{ mr: 2 }}
          >
            Share
          </Button>
          <Button
            variant="outlined"
            onClick={handleCopyLink}
            startIcon={copied ? <CheckCircle /> : <ContentCopy />}
            color={copied ? 'success' : 'primary'}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </Box>

        {/* Share URL */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Share URL
          </Typography>
          <TextField
            fullWidth
            value={shareData.url}
            variant="outlined"
            size="small"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton onClick={handleCopyLink} size="small">
                  {copied ? <CheckCircle color="success" /> : <ContentCopy />}
                </IconButton>
              ),
            }}
          />
        </Box>

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Suggested Hashtags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {hashtags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={() => {
                    const textArea = document.createElement('textarea');
                    textArea.value = `#${tag}`;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Share Statistics */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Share this post</strong> to help others discover great content!
          </Typography>
        </Box>
      </Paper>

      {/* Custom Share Dialog */}
      <Dialog open={showCustomDialog} onClose={() => setShowCustomDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share Post</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Customize your share message:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder={shareData.title}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCustomDialog(false)}>Cancel</Button>
          <Button onClick={handleCustomShare} variant="contained">
            Share on Twitter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SocialSharing; 
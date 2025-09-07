import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Article,
  Code,
  Business,
  Flight,
  Palette,
  Add,
  Preview,
  Delete,
} from '@mui/icons-material';

const ContentTemplates = ({ onTemplateSelect, onSaveTemplate, savedTemplates = [] }) => {
  const theme = useTheme();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('General');

  const defaultTemplates = [
    {
      id: 'blog-post',
      name: 'Blog Post',
      category: 'General',
      icon: <Article />,
      color: '#1976d2',
      description: 'Standard blog post template with introduction, body, and conclusion.',
      content: {
        title: 'Your Blog Post Title',
        excerpt: 'A brief summary of your blog post that will appear in previews and search results.',
        content: `<h2>Introduction</h2>
<p>Start your blog post with an engaging introduction that hooks your readers and clearly states what they'll learn from this post.</p>

<h2>Main Content</h2>
<p>This is where you'll share your main ideas, insights, and valuable information. Break your content into logical sections with clear headings.</p>

<h3>Key Points</h3>
<ul>
<li>First key point or takeaway</li>
<li>Second key point or takeaway</li>
<li>Third key point or takeaway</li>
</ul>

<h2>Conclusion</h2>
<p>Wrap up your post with a strong conclusion that reinforces your main message and encourages readers to take action or engage further.</p>`,
        tags: ['blog', 'writing', 'content'],
      },
    },
    {
      id: 'tutorial',
      name: 'Tutorial',
      category: 'Educational',
      icon: <Code />,
      color: '#388e3c',
      description: 'Step-by-step tutorial template for teaching technical concepts.',
      content: {
        title: 'How to [Task/Concept] - Complete Tutorial',
        excerpt: 'Learn how to [task/concept] with this comprehensive step-by-step tutorial.',
        content: `<h2>Prerequisites</h2>
<p>Before you begin, make sure you have the following:</p>
<ul>
<li>Required software or tools</li>
<li>Basic knowledge requirements</li>
<li>Any other prerequisites</li>
</ul>

<h2>Step 1: Getting Started</h2>
<p>Begin with the first step of your tutorial.</p>
<pre><code>// Example code or command
your-code-here</code></pre>

<h2>Step 2: [Next Step]</h2>
<p>Continue with the next step...</p>

<h2>Step 3: [Final Step]</h2>
<p>Complete your tutorial with the final step.</p>

<h2>Summary</h2>
<p>Recap what you've learned and provide next steps for readers.</p>`,
        tags: ['tutorial', 'how-to', 'learning'],
      },
    },
    {
      id: 'business-case-study',
      name: 'Business Case Study',
      category: 'Business',
      icon: <Business />,
      color: '#f57c00',
      description: 'Professional case study template for business analysis.',
      content: {
        title: '[Company/Project] Case Study: [Key Achievement]',
        excerpt: 'An in-depth analysis of how [company/project] achieved [key achievement] and the lessons learned.',
        content: `<h2>Executive Summary</h2>
<p>Brief overview of the case study and key findings.</p>

<h2>Background</h2>
<p>Provide context about the company, project, or situation being studied.</p>

<h2>Challenge</h2>
<p>Describe the problem or challenge that needed to be addressed.</p>

<h2>Solution</h2>
<p>Detail the approach, strategy, or solution that was implemented.</p>

<h2>Results</h2>
<p>Present the outcomes, metrics, and achievements.</p>

<h2>Key Takeaways</h2>
<ul>
<li>First key lesson learned</li>
<li>Second key lesson learned</li>
<li>Third key lesson learned</li>
</ul>

<h2>Conclusion</h2>
<p>Summarize the case study and its implications for similar situations.</p>`,
        tags: ['case-study', 'business', 'analysis'],
      },
    },
    {
      id: 'product-review',
      name: 'Product Review',
      category: 'Reviews',
      icon: <Palette />,
      color: '#7b1fa2',
      description: 'Comprehensive product review template with pros and cons.',
      content: {
        title: '[Product Name] Review: Is It Worth Your Money?',
        excerpt: 'An honest and detailed review of [Product Name] - find out if it\'s the right choice for you.',
        content: `<h2>Product Overview</h2>
<p>Brief introduction to the product and what it's designed to do.</p>

<h2>Key Features</h2>
<ul>
<li>Feature 1: Description and benefits</li>
<li>Feature 2: Description and benefits</li>
<li>Feature 3: Description and benefits</li>
</ul>

<h2>Design and Build Quality</h2>
<p>Discuss the product's design, materials, and overall build quality.</p>

<h2>Performance</h2>
<p>Evaluate how well the product performs in real-world use.</p>

<h2>Pros and Cons</h2>
<h3>Pros:</h3>
<ul>
<li>First advantage</li>
<li>Second advantage</li>
<li>Third advantage</li>
</ul>

<h3>Cons:</h3>
<ul>
<li>First disadvantage</li>
<li>Second disadvantage</li>
<li>Third disadvantage</li>
</ul>

<h2>Price and Value</h2>
<p>Discuss the pricing and whether the product offers good value for money.</p>

<h2>Final Verdict</h2>
<p>Your overall recommendation and who this product is best suited for.</p>`,
        tags: ['review', 'product', 'evaluation'],
      },
    },
    {
      id: 'travel-guide',
      name: 'Travel Guide',
      category: 'Travel',
      icon: <Flight />,
      color: '#00796b',
      description: 'Comprehensive travel guide template for destinations.',
      content: {
        title: 'Ultimate Travel Guide to [Destination]',
        excerpt: 'Everything you need to know about visiting [Destination] - from attractions to practical tips.',
        content: `<h2>Why Visit [Destination]?</h2>
<p>Introduction to the destination and what makes it special.</p>

<h2>Best Time to Visit</h2>
<p>Information about weather, seasons, and the ideal time to plan your trip.</p>

<h2>Getting There</h2>
<p>Transportation options and how to reach the destination.</p>

<h2>Where to Stay</h2>
<p>Accommodation recommendations for different budgets.</p>

<h2>Top Attractions</h2>
<ul>
<li><strong>Attraction 1:</strong> Description and tips</li>
<li><strong>Attraction 2:</strong> Description and tips</li>
<li><strong>Attraction 3:</strong> Description and tips</li>
</ul>

<h2>Local Cuisine</h2>
<p>Must-try foods and dining recommendations.</p>

<h2>Practical Tips</h2>
<ul>
<li>Tip 1 for visitors</li>
<li>Tip 2 for visitors</li>
<li>Tip 3 for visitors</li>
</ul>

<h2>Budget Breakdown</h2>
<p>Estimated costs for accommodation, food, activities, and transportation.</p>`,
        tags: ['travel', 'guide', 'destination'],
      },
    },
  ];

  const categories = [
    'General',
    'Educational',
    'Business',
    'Reviews',
    'Travel',
    'Technology',
    'Lifestyle',
    'Health',
    'Custom',
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    onTemplateSelect && onTemplateSelect(template);
  };

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      const newTemplate = {
        id: `custom-${Date.now()}`,
        name: templateName,
        category: templateCategory,
        icon: <Add />,
        color: theme.palette.primary.main,
        description: 'Custom template saved by you.',
        content: selectedTemplate.content,
        isCustom: true,
      };
      onSaveTemplate && onSaveTemplate(newTemplate);
      setShowSaveDialog(false);
      setTemplateName('');
    }
  };

  const allTemplates = [...defaultTemplates, ...savedTemplates];

  const TemplateCard = ({ template }) => (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
      onClick={() => handleTemplateSelect(template)}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: template.color,
              color: 'white',
              borderRadius: '50%',
              p: 1,
              mr: 2,
            }}
          >
            {template.icon}
          </Box>
          <Typography variant="h6" component="h3">
            {template.name}
          </Typography>
        </Box>
        
        <Chip 
          label={template.category} 
          size="small" 
          variant="outlined" 
          sx={{ mb: 2 }}
        />
        
        <Typography variant="body2" color="text.secondary">
          {template.description}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Button size="small" startIcon={<Preview />}>
          Preview
        </Button>
        {template.isCustom && (
          <IconButton size="small" color="error">
            <Delete />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );

  return (
    <>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Content Templates</Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setShowSaveDialog(true)}
            disabled={!selectedTemplate}
          >
            Save Current as Template
          </Button>
        </Box>

        <Grid container spacing={3}>
          {allTemplates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <TemplateCard template={template} />
            </Grid>
          ))}
        </Grid>

        {allTemplates.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No templates available. Create your first template to get started!
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Save Template Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save as Template</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={templateCategory}
              label="Category"
              onChange={(e) => setTemplateCategory(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveTemplate} 
            variant="contained"
            disabled={!templateName.trim()}
          >
            Save Template
          </Button>
        </DialogActions>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog 
        open={showPreview} 
        onClose={() => setShowPreview(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Template Preview: {selectedTemplate?.name}
        </DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box>
              <Typography variant="h5" gutterBottom>
                {selectedTemplate.content.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedTemplate.content.excerpt}
              </Typography>
              <Box 
                dangerouslySetInnerHTML={{ __html: selectedTemplate.content.content }}
                sx={{
                  '& h2': { mt: 3, mb: 2, color: 'primary.main' },
                  '& h3': { mt: 2, mb: 1, color: 'text.primary' },
                  '& ul': { pl: 2 },
                  '& li': { mb: 0.5 },
                  '& pre': { 
                    backgroundColor: 'grey.100', 
                    p: 2, 
                    borderRadius: 1,
                    overflow: 'auto'
                  },
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
          <Button 
            onClick={() => {
              handleTemplateSelect(selectedTemplate);
              setShowPreview(false);
            }} 
            variant="contained"
          >
            Use This Template
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContentTemplates; 
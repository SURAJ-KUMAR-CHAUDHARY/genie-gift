#!/bin/bash

# Build the Next.js application
echo "Building Next.js application..."
npm run build

# Export the static site
echo "Exporting static site..."
npm run export

# Create .nojekyll file for GitHub Pages
echo "Creating .nojekyll file..."
touch out/.nojekyll

# Copy the redirect index.html to the root if it doesn't exist
if [ ! -f index.html ]; then
    echo "Creating root redirect..."
    cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>GiftGenie AI - Redirecting...</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #7c3aed 0%, #fea619 100%);
            color: white;
        }
        .container {
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .logo {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <span>✨</span>
            GiftGenie AI
        </div>
        <p>Deploying your application...</p>
        <div class="spinner"></div>
        <p style="margin-top: 20px; font-size: 0.9rem; opacity: 0.8;">
            If you're not redirected automatically, <a href="/genie-gift/" style="color: #ffd8ea; text-decoration: underline;">click here</a>.
        </p>
    </div>
    
    <script>
        setTimeout(function() {
            window.location.href = '/genie-gift/';
        }, 1000);
    </script>
</body>
</html>
EOF
fi

echo "Build and export completed!"
echo "Files are ready in the 'out' directory for GitHub Pages deployment."
echo ""
echo "To deploy manually:"
echo "1. Go to your GitHub repository settings"
echo "2. Under 'Pages', set source to 'Deploy from a branch'"
echo "3. Select 'gh-pages' branch"
echo "4. Push the 'out' directory to the 'gh-pages' branch"
echo ""
echo "Or run: git subtree push --prefix out origin gh-pages"
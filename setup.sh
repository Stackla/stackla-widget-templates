echo "Setting up the project..."
echo "Initialising submodules..."
git submodule init
git submodule update --remote --recursive
echo "Installing dependencies..."
npm install
npx playwright install --with-deps
echo "Adding Stackla widget templates as a remote..."
git remote add stackla-origin https://github.com/Stackla/stackla-widget-templates
git fetch stackla-origin
echo "Merging Stackla widget templates..."
git stash
git merge stackla-origin/master
git stash pop
echo "Setup complete. You can now start using the Stackla widget templates."
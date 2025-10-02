# Widget Templates

## Build your dream widget.

Welcome! We recommend that you have a read of our guide on how to build widgets at https://docs.nosto.com/ugc.

It will guide you set by step on how to build your first widget.

Once you have read our guide, you can begin setting up your IDE for widget template development.
To get started, follow the instructions below
1) Clone your Forked repo of stackla/stackla-widget-templates. You can do this by executing 
```git clone https://your-github-repo-here```

2) Utilise a code editor such as VSCode to prepare your IDE for development
3) Inside the folder, fetch the latest widget-utils repository submodule.

NOTE: If you would like to use your own widget utilities fork, you can also update the .gitmodules file and place the URL to your git repository there.

Execute the following;

1) ```./setup.sh```
2) Execute ```npm run start``` to see our gallery of widgets in action.
3) Access the following URL, substituting the widgetType with any widget you wish to preview.

http://localhost:4003/preview?widgetType=carousel

Congratulations! You are now ready to start developing your first widget. 

Lets get started.

## Test structure
We use Playwright for end to end testing. You can find the tests in the `tests/e2e` folder.
Tests are organized into:
- `assertions`: Reusable assertions that can be shared across multiple tests.
- `locators`: Locators for different components in the widget. These are encapsulated in closures for better reusability.
- `utilities`: General utility functions for setting up tests and common operations.
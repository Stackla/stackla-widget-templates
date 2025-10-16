const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

const env = process.env.APP_ENV || "development";

/**
 * Build hooks configuration - similar structure to serverless.ts hooks
 * These define what build steps run for each environment
 */
const getHooks = (env) => {
  switch (env) {
    case "testing":
      return {
        build: [`npm run test:build`]
      };
    case "development":
      return {
        build: [`npm run build:development`]
      };
    case "pipeline":
      return {
        build: [`npm run build:pipeline`]
      };
    case "production":
      return {
        build: [
          `npm run build:production`,
          // Add any additional production build steps here
        ]
      };
    case "staging":
      return {
        build: [
          `npm run build:staging`,
          // Add any additional staging build steps here
        ]
      };
    default:
      return {
        build: [`npm run build:${env}`]
      };
  }
};

/**
 * Execute hooks for the current environment
 */
async function executeHooks() {
  const hooks = getHooks(env);
  
  console.log(`\n🔨 Executing build hooks for environment: ${env}\n`);
  
  for (const [hookName, commands] of Object.entries(hooks)) {
    console.log(`📋 Running ${hookName} hooks...`);
    
    for (const command of commands) {
      console.log(`  ▶ ${command}`);
      try {
        const { stdout, stderr } = await execPromise(command, {
          env: { ...process.env, APP_ENV: env }
        });
        
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
      } catch (error) {
        console.error(`  ❌ Failed to execute: ${command}`);
        console.error(error.message);
        process.exit(1);
      }
    }
  }
  
  console.log(`\n✅ Build hooks completed successfully for ${env}\n`);
}

// Run if called directly
if (require.main === module) {
  executeHooks().catch(error => {
    console.error("Build failed:", error);
    process.exit(1);
  });
}

module.exports = { getHooks, executeHooks };

/**
 * Deploy to Render - Direct Deployment Script
 * 
 * This script can:
 * 1. Trigger a manual deployment via Render API
 * 2. Check deployment status
 * 3. Monitor build progress
 * 
 * Usage:
 *   node deploy-to-render.js [trigger|status|monitor]
 * 
 * Setup:
 *   1. Get Render API key from: https://dashboard.render.com/account/api-keys
 *   2. Add to .env: RENDER_API_KEY=your_api_key_here
 *   3. Service ID is already in render.yaml (srv-d5m8hjlactks73bn8v00)
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const SERVICE_ID = 'srv-d5m8hjlactks73bn8v00'; // From your Render dashboard
const RENDER_API_BASE = 'https://api.render.com/v1';

if (!RENDER_API_KEY) {
    console.error('❌ RENDER_API_KEY not found in .env');
    console.error('');
    console.error('📝 To enable direct deployment:');
    console.error('   1. Go to: https://dashboard.render.com/account/api-keys');
    console.error('   2. Create a new API key');
    console.error('   3. Add to .env: RENDER_API_KEY=your_key_here');
    console.error('');
    console.error('💡 Alternative: Render should auto-deploy when you push to GitHub!');
    console.error('   Just run: git push');
    process.exit(1);
}

/**
 * Trigger a manual deployment
 */
async function triggerDeployment() {
    console.log('🚀 Triggering Render deployment...\n');
    
    try {
        const response = await fetch(`${RENDER_API_BASE}/services/${SERVICE_ID}/deploys`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RENDER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clearCache: false
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`❌ Error triggering deployment (${response.status}):`);
            console.error(JSON.stringify(data, null, 2));
            return null;
        }

        console.log('✅ Deployment triggered successfully!');
        console.log(`   Deploy ID: ${data.id}`);
        console.log(`   Status: ${data.status}`);
        console.log(`   URL: https://dashboard.render.com/web/${SERVICE_ID}`);
        console.log('');
        console.log('📊 Monitoring deployment...');
        
        return data.id;
    } catch (error) {
        console.error('❌ Error triggering deployment:', error.message);
        return null;
    }
}

/**
 * Get deployment status
 */
async function getDeploymentStatus(deployId = null) {
    try {
        let url = `${RENDER_API_BASE}/services/${SERVICE_ID}/deploys`;
        if (deployId) {
            url = `${RENDER_API_BASE}/deploys/${deployId}`;
        } else {
            // Get latest deployment
            url += '?limit=1';
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${RENDER_API_KEY}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`❌ Error getting status (${response.status}):`);
            console.error(JSON.stringify(data, null, 2));
            return null;
        }

        const deploy = Array.isArray(data) ? data[0] : data;
        
        console.log('📊 Deployment Status:');
        console.log(`   ID: ${deploy.id}`);
        console.log(`   Status: ${deploy.status}`);
        console.log(`   Created: ${new Date(deploy.createdAt).toLocaleString()}`);
        if (deploy.finishedAt) {
            console.log(`   Finished: ${new Date(deploy.finishedAt).toLocaleString()}`);
        }
        console.log(`   Commit: ${deploy.commit?.message || 'N/A'}`);
        console.log(`   Branch: ${deploy.commit?.branch || 'N/A'}`);
        
        return deploy;
    } catch (error) {
        console.error('❌ Error getting status:', error.message);
        return null;
    }
}

/**
 * Monitor deployment progress
 */
async function monitorDeployment(deployId) {
    console.log('👀 Monitoring deployment...\n');
    
    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        const deploy = await getDeploymentStatus(deployId);
        
        if (!deploy) {
            console.error('❌ Could not get deployment status');
            break;
        }

        const status = deploy.status;
        const statusEmoji = {
            'created': '🆕',
            'build_in_progress': '🔨',
            'update_in_progress': '🔄',
            'live': '✅',
            'build_failed': '❌',
            'update_failed': '❌',
            'canceled': '⚠️'
        }[status] || '❓';

        process.stdout.write(`\r${statusEmoji} Status: ${status}${' '.repeat(20)}`);

        if (status === 'live') {
            console.log('\n\n✅ Deployment complete!');
            console.log(`   Site: https://successchemistry.com`);
            break;
        }

        if (status === 'build_failed' || status === 'update_failed') {
            console.log('\n\n❌ Deployment failed!');
            console.log('   Check logs: https://dashboard.render.com/web/' + SERVICE_ID);
            break;
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    }

    if (attempts >= maxAttempts) {
        console.log('\n\n⏱️  Monitoring timeout - check dashboard for status');
    }
}

/**
 * Main function
 */
async function main() {
    const command = process.argv[2] || 'trigger';

    console.log('='.repeat(60));
    console.log('Render Deployment Tool');
    console.log('='.repeat(60));
    console.log(`Service ID: ${SERVICE_ID}`);
    console.log(`Command: ${command}`);
    console.log('');

    switch (command) {
        case 'trigger':
        case 'deploy':
            const deployId = await triggerDeployment();
            if (deployId) {
                await monitorDeployment(deployId);
            }
            break;

        case 'status':
            await getDeploymentStatus();
            break;

        case 'monitor':
            const latest = await getDeploymentStatus();
            if (latest && latest.id) {
                await monitorDeployment(latest.id);
            }
            break;

        default:
            console.log('Usage: node deploy-to-render.js [trigger|status|monitor]');
            console.log('');
            console.log('Commands:');
            console.log('  trigger  - Trigger a new deployment');
            console.log('  status   - Check current deployment status');
            console.log('  monitor  - Monitor latest deployment progress');
            console.log('');
            console.log('💡 Note: Render should auto-deploy on git push!');
            console.log('   Just run: git add . && git commit -m "..." && git push');
    }
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});

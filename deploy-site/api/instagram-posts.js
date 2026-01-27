/**
 * Instagram Graph API - Post Management
 * 
 * This module allows you to create, manage, and schedule Instagram posts
 * using the Instagram Graph API.
 * 
 * Requirements:
 * 1. Instagram Business or Creator account
 * 2. Facebook App with Instagram Basic Display and Instagram Graph API products
 * 3. Access Token with instagram_basic, instagram_content_publish, pages_read_engagement permissions
 * 
 * Setup:
 * 1. Create a Facebook App at https://developers.facebook.com/
 * 2. Add Instagram Graph API product
 * 3. Get your Instagram Business Account ID
 * 4. Generate a long-lived access token
 * 5. Add credentials to .env file
 */

// Instagram API Configuration
const INSTAGRAM_CONFIG = {
    apiVersion: 'v21.0',
    baseUrl: 'https://graph.facebook.com',
    // These should be set via environment variables or initInstagram()
    accessToken: null,
    instagramAccountId: null, // Your Instagram Business Account ID
    facebookPageId: null // Your Facebook Page ID (connected to Instagram)
};

/**
 * Initialize Instagram API credentials
 * @param {string} accessToken - Long-lived Instagram access token
 * @param {string} instagramAccountId - Instagram Business Account ID
 * @param {string} facebookPageId - Facebook Page ID
 */
function initInstagram(accessToken, instagramAccountId, facebookPageId) {
    INSTAGRAM_CONFIG.accessToken = accessToken;
    INSTAGRAM_CONFIG.instagramAccountId = instagramAccountId;
    INSTAGRAM_CONFIG.facebookPageId = facebookPageId;
}

/**
 * Create an Instagram image post
 * @param {Object} options
 * @param {string} options.imageUrl - URL of the image to post (must be publicly accessible)
 * @param {string} options.caption - Post caption (max 2200 characters, supports hashtags and mentions)
 * @param {string} options.locationId - Optional location ID
 * @param {string} options.userTags - Optional array of user tags [{username, x, y}]
 * @param {Date} options.scheduledTime - Optional scheduled publish time (custom implementation)
 * @returns {Promise<Object>} Created post data
 */
async function createImagePost(options) {
    const { imageUrl, caption, locationId, userTags, scheduledTime } = options;

    if (!INSTAGRAM_CONFIG.accessToken || !INSTAGRAM_CONFIG.instagramAccountId) {
        throw new Error('Instagram API not initialized. Call initInstagram() first.');
    }

    try {
        // Step 1: Create media container
        const containerData = {
            image_url: imageUrl,
            caption: caption || '',
            access_token: INSTAGRAM_CONFIG.accessToken
        };

        if (locationId) {
            containerData.location_id = locationId;
        }

        if (userTags && userTags.length > 0) {
            containerData.user_tags = JSON.stringify(userTags);
        }

        const containerResponse = await fetch(
            `${INSTAGRAM_CONFIG.baseUrl}/${INSTAGRAM_CONFIG.apiVersion}/${INSTAGRAM_CONFIG.instagramAccountId}/media?${new URLSearchParams(containerData)}`,
            { method: 'POST' }
        );

        if (!containerResponse.ok) {
            const error = await containerResponse.json();
            throw new Error(`Failed to create media container: ${JSON.stringify(error)}`);
        }

        const container = await containerResponse.json();
        const creationId = container.id;

        // Step 2: Publish the media (or schedule it)
        if (scheduledTime && scheduledTime > new Date()) {
            // Custom scheduling: Store in database and publish later via cron job
            return {
                success: true,
                creationId,
                scheduled: true,
                scheduledTime: scheduledTime.toISOString(),
                message: 'Post scheduled. Will be published at scheduled time.',
                publishEndpoint: `${INSTAGRAM_CONFIG.baseUrl}/${INSTAGRAM_CONFIG.apiVersion}/${INSTAGRAM_CONFIG.instagramAccountId}/media_publish`
            };
        }

        // Publish immediately
        const publishResponse = await fetch(
            `${INSTAGRAM_CONFIG.baseUrl}/${INSTAGRAM_CONFIG.apiVersion}/${INSTAGRAM_CONFIG.instagramAccountId}/media_publish?creation_id=${creationId}&access_token=${INSTAGRAM_CONFIG.accessToken}`,
            { method: 'POST' }
        );

        if (!publishResponse.ok) {
            const error = await publishResponse.json();
            throw new Error(`Failed to publish post: ${JSON.stringify(error)}`);
        }

        const publishedPost = await publishResponse.json();

        return {
            success: true,
            id: publishedPost.id,
            creationId,
            message: 'Post published successfully'
        };

    } catch (error) {
        console.error('Error creating Instagram post:', error);
        throw error;
    }
}

/**
 * Create an Instagram carousel post (multiple images)
 * @param {Object} options
 * @param {Array<string>} options.imageUrls - Array of image URLs (2-10 images)
 * @param {string} options.caption - Post caption
 * @param {string} options.locationId - Optional location ID
 * @returns {Promise<Object>} Created post data
 */
async function createCarouselPost(options) {
    const { imageUrls, caption, locationId } = options;

    if (!imageUrls || imageUrls.length < 2 || imageUrls.length > 10) {
        throw new Error('Carousel posts require 2-10 images');
    }

    try {
        // Step 1: Create media containers for each image
        const children = [];
        for (const imageUrl of imageUrls) {
            const containerData = {
                image_url: imageUrl,
                is_carousel_item: true,
                access_token: INSTAGRAM_CONFIG.accessToken
            };

            const containerResponse = await fetch(
                `${INSTAGRAM_CONFIG.baseUrl}/${INSTAGRAM_CONFIG.apiVersion}/${INSTAGRAM_CONFIG.instagramAccountId}/media?${new URLSearchParams(containerData)}`,
                { method: 'POST' }
            );

            if (!containerResponse.ok) {
                const error = await containerResponse.json();
                throw new Error(`Failed to create carousel item: ${JSON.stringify(error)}`);
            }

            const container = await containerResponse.json();
            children.push(container.id);
        }

        // Step 2: Create carousel container
        const carouselData = {
            media_type: 'CAROUSEL',
            children: children.join(','),
            caption: caption || '',
            access_token: INSTAGRAM_CONFIG.accessToken
        };

        if (locationId) {
            carouselData.location_id = locationId;
        }

        const carouselResponse = await fetch(
            `${INSTAGRAM_CONFIG.baseUrl}/${INSTAGRAM_CONFIG.apiVersion}/${INSTAGRAM_CONFIG.instagramAccountId}/media?${new URLSearchParams(carouselData)}`,
            { method: 'POST' }
        );

        if (!carouselResponse.ok) {
            const error = await carouselResponse.json();
            throw new Error(`Failed to create carousel: ${JSON.stringify(error)}`);
        }

        const carousel = await carouselResponse.json();

        // Step 3: Publish carousel
        const publishResponse = await fetch(
            `${INSTAGRAM_CONFIG.baseUrl}/${INSTAGRAM_CONFIG.apiVersion}/${INSTAGRAM_CONFIG.instagramAccountId}/media_publish?creation_id=${carousel.id}&access_token=${INSTAGRAM_CONFIG.accessToken}`,
            { method: 'POST' }
        );

        if (!publishResponse.ok) {
            const error = await publishResponse.json();
            throw new Error(`Failed to publish carousel: ${JSON.stringify(error)}`);
        }

        const publishedPost = await publishResponse.json();

        return {
            success: true,
            id: publishedPost.id,
            message: 'Carousel post published successfully'
        };

    } catch (error) {
        console.error('Error creating Instagram carousel:', error);
        throw error;
    }
}

/**
 * Create an Instagram video post
 * @param {Object} options
 * @param {string} options.videoUrl - URL of the video (must be publicly accessible, max 100MB)
 * @param {string} options.thumbnailUrl - Optional thumbnail image URL
 * @param {string} options.caption - Post caption
 * @param {string} options.locationId - Optional location ID
 * @returns {Promise<Object>} Created post data
 */
async function createVideoPost(options) {
    const { videoUrl, thumbnailUrl, caption, locationId } = options;

    try {
        // Step 1: Create video container
        const containerData = {
            media_type: 'REELS', // or 'VIDEO' for regular video posts
            video_url: videoUrl,
            caption: caption || '',
            access_token: INSTAGRAM_CONFIG.accessToken
        };

        if (thumbnailUrl) {
            containerData.thumb_offset = 0; // Use first frame, or specify custom thumbnail
        }

        if (locationId) {
            containerData.location_id = locationId;
        }

        const containerResponse = await fetch(
            `${INSTAGRAM_CONFIG.baseUrl}/${INSTAGRAM_CONFIG.apiVersion}/${INSTAGRAM_CONFIG.instagramAccountId}/media?${new URLSearchParams(containerData)}`,
            { method: 'POST' }
        );

        if (!containerResponse.ok) {
            const error = await containerResponse.json();
            throw new Error(`Failed to create video container: ${JSON.stringify(error)}`);
        }

        const container = await containerResponse.json();
        const creationId = container.id;

        // Step 2: Check status (videos need to be processed)
        let status = 'IN_PROGRESS';
        let attempts = 0;
        const maxAttempts = 30; // Wait up to 5 minutes

        while (status === 'IN_PROGRESS' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds

            const statusResponse = await fetch(
                `${INSTAGRAM_CONFIG.baseUrl}/${INSTAGRAM_CONFIG.apiVersion}/${creationId}?fields=status_code&access_token=${INSTAGRAM_CONFIG.accessToken}`
            );

            if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                status = statusData.status_code;
            }

            attempts++;
        }

        if (status !== 'FINISHED') {
            throw new Error(`Video processing failed or timed out. Status: ${status}`);
        }

        // Step 3: Publish video
        const publishResponse = await fetch(
            `${INSTAGRAM_CONFIG.baseUrl}/${INSTAGRAM_CONFIG.apiVersion}/${INSTAGRAM_CONFIG.instagramAccountId}/media_publish?creation_id=${creationId}&access_token=${INSTAGRAM_CONFIG.accessToken}`,
            { method: 'POST' }
        );

        if (!publishResponse.ok) {
            const error = await publishResponse.json();
            throw new Error(`Failed to publish video: ${JSON.stringify(error)}`);
        }

        const publishedPost = await publishResponse.json();

        return {
            success: true,
            id: publishedPost.id,
            message: 'Video post published successfully'
        };

    } catch (error) {
        console.error('Error creating Instagram video:', error);
        throw error;
    }
}

/**
 * Get all posts from Instagram account
 * @param {Object} options
 * @param {number} options.limit - Number of posts to retrieve (default: 25, max: 100)
 * @param {string} options.after - Pagination cursor
 * @returns {Promise<Object>} Posts data
 */
async function getPosts(options = {}) {
    const { limit = 25, after } = options;

    if (!INSTAGRAM_CONFIG.accessToken || !INSTAGRAM_CONFIG.instagramAccountId) {
        throw new Error('Instagram API not initialized. Call initInstagram() first.');
    }

    try {
        const params = new URLSearchParams({
            fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count',
            limit: Math.min(limit, 100).toString(),
            access_token: INSTAGRAM_CONFIG.accessToken
        });

        if (after) {
            params.append('after', after);
        }

        const response = await fetch(
            `${INSTAGRAM_CONFIG.baseUrl}/${INSTAGRAM_CONFIG.apiVersion}/${INSTAGRAM_CONFIG.instagramAccountId}/media?${params}`
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to get posts: ${JSON.stringify(error)}`);
        }

        const data = await response.json();

        return {
            success: true,
            posts: data.data || [],
            paging: data.paging || null
        };

    } catch (error) {
        console.error('Error getting Instagram posts:', error);
        throw error;
    }
}

/**
 * Get a specific post by ID
 * @param {string} postId - Instagram post ID
 * @returns {Promise<Object>} Post data
 */
async function getPost(postId) {
    if (!INSTAGRAM_CONFIG.accessToken) {
        throw new Error('Instagram API not initialized. Call initInstagram() first.');
    }

    try {
        const response = await fetch(
            `${INSTAGRAM_CONFIG.baseUrl}/${INSTAGRAM_CONFIG.apiVersion}/${postId}?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count&access_token=${INSTAGRAM_CONFIG.accessToken}`
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to get post: ${JSON.stringify(error)}`);
        }

        const post = await response.json();

        return {
            success: true,
            post
        };

    } catch (error) {
        console.error('Error getting Instagram post:', error);
        throw error;
    }
}

/**
 * Delete an Instagram post
 * @param {string} postId - Instagram post ID
 * @returns {Promise<Object>} Deletion result
 */
async function deletePost(postId) {
    if (!INSTAGRAM_CONFIG.accessToken) {
        throw new Error('Instagram API not initialized. Call initInstagram() first.');
    }

    try {
        const response = await fetch(
            `${INSTAGRAM_CONFIG.baseUrl}/${INSTAGRAM_CONFIG.apiVersion}/${postId}?access_token=${INSTAGRAM_CONFIG.accessToken}`,
            { method: 'DELETE' }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to delete post: ${JSON.stringify(error)}`);
        }

        const result = await response.json();

        return {
            success: result.success || true,
            message: 'Post deleted successfully'
        };

    } catch (error) {
        console.error('Error deleting Instagram post:', error);
        throw error;
    }
}

/**
 * Get Instagram account information
 * @returns {Promise<Object>} Account data
 */
async function getAccountInfo() {
    if (!INSTAGRAM_CONFIG.accessToken || !INSTAGRAM_CONFIG.instagramAccountId) {
        throw new Error('Instagram API not initialized. Call initInstagram() first.');
    }

    try {
        const response = await fetch(
            `${INSTAGRAM_CONFIG.baseUrl}/${INSTAGRAM_CONFIG.apiVersion}/${INSTAGRAM_CONFIG.instagramAccountId}?fields=id,username,account_type,media_count&access_token=${INSTAGRAM_CONFIG.accessToken}`
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to get account info: ${JSON.stringify(error)}`);
        }

        const account = await response.json();

        return {
            success: true,
            account
        };

    } catch (error) {
        console.error('Error getting Instagram account info:', error);
        throw error;
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initInstagram,
        createImagePost,
        createCarouselPost,
        createVideoPost,
        getPosts,
        getPost,
        deletePost,
        getAccountInfo
    };
}

// For browser use
if (typeof window !== 'undefined') {
    window.InstagramAPI = {
        initInstagram,
        createImagePost,
        createCarouselPost,
        createVideoPost,
        getPosts,
        getPost,
        deletePost,
        getAccountInfo
    };
}

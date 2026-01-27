/**
 * Fix eBay Sclera Listing - Add Required Shade Field
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ACCESS_TOKEN = process.env.EBAY_ACCESS_TOKEN || "v^1.1#i^1#p^3#I^3#r^0#f^0#t^H4sIAAAAAAAA/+1ZfYwbxRU/3xdEIXwoESkQ0YuTIyKntWd3vbv2Kjb4znbOuTufz/aFXIC4s7uz5yX27rIz6ztXqnQ6SgSiEoUGOEBIB1JQ+AYhQgS0IpWISkRVNVIrIVURUvNHpUqtREoLEbTM+u6cu0MkKA5gie4ftmfm+c37/d57M/N2wEz3mu0HBg/8Z53vsvb5GTDT7vOxa8Ga7q6+Kzvar+9qA8sEfPMzW2c6Zzv+tgPDStmWcwjblolRz3SlbGK53hn1u44pWxAbWDZhBWGZqHI+PjIscwEg245FLNUq+3vSiagfQVYRVUHXQ/RHmI3QXnNJZ8GK+gVRgRFFEFSkgJCIVDqOsYvSJibQJFE/BziRASzDSQXAynxY5tmAFBL3+nt2IwcblklFAsAfq5sr1//rLLP1/KZCjJFDqBJ/LB1P5Ufj6UQyU9gRXKYrtshDnkDi4pWtAUtDPbth2UXnnwbXpeW8q6oIY38wtjDDSqVyfMmYizC/TrXI8opEH0HUKOch4ZJQmbKcCiTnt8PrMTRGr4vKyCQGqV2IUcqGchdSyWIrQ1WkEz3e15gLy4ZuICfqT/bHJ8bzyZy/J5/NOlbV0JDmIZVCYY5jQxRiDC+QWlRLqGJg4tQW51pQuMj0qskGLFMzPN5wT8Yi/YgajlbTwy2jhwqNmqNOXCeeUcvl+CUa+fBez68LjnRJyfRciyqUi55688JOWIqKc3FwqeICCZKgQlEQkKgonKSsjAsv1y8uNmKee+LZbNCzBSmwxlSgsx8RuwxVxKiUXreCHEOTeUHn+LCOGE2M6EwoouuMImgiw+oIAYQURY2Ef2AhQohjKC5BjTBZPVDHGfXnVctGWatsqDX/apH6yrMYFNM46i8RYsvB4NTUVGCKD1jOZJADgA3uGRnOe9ChvyFrXFiYMerhoSL6L2zIpGZTa6Zp9NHJzUl/jHe0LHRILY/KZdqxFLsrbIut7v0akANlgzJQoFO0FsZBCxOkNQVNQ1VDRUVDawlkXq430HGcJEXCYZ4VAJCaAlm2Jg1zBJGS1RowGxCTI/H0cFPQ6DIKSWuBYiUxEhLZCBtpClncttOVikugUkbpFvObIIQEwDcFz3bdFkm6BqrUFE4Vivnbxu4ymoLmbbWyAXWZWPuR+XXLppfr3x/WXDKVS+YHi4XRoWSmKbQ5pDsIlwoe1laL0/hYfDhOn5FdRmp4OjWWtvqH4KCEsMSnJqp5nu0je3fZNTbODk0O9xWye3bidGIg+VPFSmQMSxJzCd5KliV+eCwabYqkPFId1GLrlM2nLDjA1UZSfYoLxgb7JjJA0fQItpyJ/claf7CaJdXduwtuUG0O/Mhkq2X6pdtaC+dL8QZAL9e/c5DOQmIW66tQkbaaApqcbLn1WlMUUaXlBBtRANQiHC8BloOSrusoJPKq2PT222J4c9AuQVQeYgZchyYpk80lGKCEQgBpQGHCehhCJdTcocNuOSdfqk0Ze4XadwHNy/VvDs/TgakSaBsB79wQUK1K0IIuKXldxbrVQUxruIBhVmkRZjWq44s8LyPNcGgZXXQdo7UcvRjdxSFYqSCHWR3spWlTnbSbwu6x2opVUDaez982mks0BS6Bqq22XoUAhzhOB0yI1kP0Q9SZMIxoDI80SdNQREcSagrz9176dc62s99S+ZdDsFxpLX/ajqW5qvfS7f/IVnUse034lZfEwZUXNbG2+sPO+n4LZn2/aff5wA7Qy24Bm7s7xjs7rrgeGwQFaPkYwMakCYnroMB+VLOh4bSvbzvxpw8zN7696/D9pzfO3Ls1+HDblcvuiebvBD9q3BSt6WDXLrs2ApvOjXSxV21cx4n0tERPTDw9Bu8FW86NdrLXdm746LGRt/6R+WfB6Te6nu4Ttpw5kJgD6xpCPl9XW+esr+0+vXI7/8LaQ8d+lrnhyIarj+ovH3r+/rnYyVfu+y97zZ2lh28uPPfgdflNrw0/xJ91T9zSu23gd/Of95If/3yM/0BUpnb+5KTyODPzUuLo/1481f3rpw7/66renebmm55TTn6y/Yr0hoF9Fh+cnrv9lY/PZKUb0WWVg/jo2qFtZx+54+BW/IfCryZ2XH5s04SY+eu+Q59++ol6JvfHZ8a/ODTH3/3CRuvYE+9UJx666R5z+y0fjp9WTu77xbMPxE6/OX9kbuu73de99/57917uPnLH+Nnj43+/9eBnDyb/3PlAG1z3ce2GzMSbr6Kbo79fnx077nz+l7d6T53q7n35yJmPquyTe5x/v3rg+OtvbH70mROx6PpfLvjySxAlOHbBGwAA";
const BASE_URL = 'https://api.ebay.com';
const SKU = '10786-807';

// Load products data
let PRODUCTS_DATA;
try {
    const productsPath = join(__dirname, 'deploy-site', 'products-data.js');
    const productsContent = readFileSync(productsPath, 'utf8');
    const modifiedContent = productsContent.replace(/^const PRODUCTS_DATA/, 'var PRODUCTS_DATA') + '\nPRODUCTS_DATA;';
    const func = new Function(modifiedContent + '\nreturn PRODUCTS_DATA;');
    PRODUCTS_DATA = func();
} catch (err) {
    console.error('❌ Could not load products-data.js:', err.message);
    process.exit(1);
}

const product = PRODUCTS_DATA[SKU];
if (!product) {
    console.error(`❌ Product with SKU "${SKU}" not found`);
    process.exit(1);
}

async function fixInventoryItem() {
    console.log('🔧 Fixing inventory item - Adding Shade field...\n');
    
    // First, get current inventory item
    const getResponse = await fetch(`${BASE_URL}/sell/inventory/v1/inventory_item/${SKU}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        }
    });

    const currentItem = await getResponse.json();
    
    if (!getResponse.ok) {
        console.error('❌ Could not get current inventory item');
        console.error(JSON.stringify(currentItem, null, 2));
        return false;
    }

    // Add required fields to aspects
    const aspects = currentItem.product?.aspects || {};
    aspects['Shade'] = ['Not Applicable']; // For supplements, shade is typically N/A
    aspects['Type'] = ['Dietary Supplement']; // Required type field
    
    const updatedItem = {
        ...currentItem,
        product: {
            ...currentItem.product,
            aspects: aspects
        }
    };

    try {
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/inventory_item/${SKU}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Language': 'en-US',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            },
            body: JSON.stringify(updatedItem)
        });
        
        const responseText = await response.text();
        let responseData = {};
        
        try {
            responseData = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
            console.error('❌ Invalid JSON response:', responseText.substring(0, 500));
            return false;
        }
        
        if (!response.ok) {
            console.error(`❌ Error updating inventory item (${response.status}):`);
            if (responseData.errors && responseData.errors.length > 0) {
                responseData.errors.forEach(err => {
                    console.error(`   Error ${err.errorId}: ${err.message}`);
                });
            }
            return false;
        }
        
        console.log('✅ Inventory item updated with Shade field!');
        return true;
    } catch (error) {
        console.error('❌ Error updating inventory item:', error.message);
        return false;
    }
}

async function main() {
    console.log('='.repeat(70));
    console.log('Fix eBay Sclera Listing - Add Shade Field');
    console.log('='.repeat(70));
    console.log('');
    
    const fixed = await fixInventoryItem();
    
    if (fixed) {
        console.log('');
        console.log('✅ Fixed! Now try publishing again:');
        console.log('   node publish-ebay-offer.js 10786-807');
        console.log('');
    } else {
        console.log('');
        console.log('❌ Failed to fix inventory item');
        process.exit(1);
    }
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});

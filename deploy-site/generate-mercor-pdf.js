#!/usr/bin/env node
/**
 * Generate Mercor AI Training Application as PDF.
 * Run from repo root: node deploy-site/generate-mercor-pdf.js
 * Output: deploy-site/Mercor-AI-Training-Application.pdf
 */

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const htmlPath = path.join(__dirname, 'mercor-ai-training-application.html');
const pdfPath = path.join(__dirname, 'Mercor-AI-Training-Application.pdf');
const htmlUrl = 'file://' + htmlPath;

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(htmlUrl, { waitUntil: 'networkidle' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '16px', right: '16px', bottom: '16px', left: '16px' },
  });
  await browser.close();
  console.log('PDF saved:', pdfPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

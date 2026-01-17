/**
 * COMPLIANCE ENGINE
 * FDA/FTC compliance validation and enforcement
 * Ensures all content meets regulatory requirements
 */

export class ComplianceEngine {
  constructor() {
    this.prohibitedTerms = this.initializeProhibitedTerms();
    this.requiredDisclaimers = this.initializeDisclaimers();
  }

  /**
   * Initialize prohibited terms database
   */
  initializeProhibitedTerms() {
    return {
      diseaseClaims: [
        'cure', 'cures', 'curing',
        'treat', 'treats', 'treatment',
        'prevent', 'prevents', 'prevention',
        'diagnose', 'diagnosis',
        'disease', 'diseases',
        'cancer', 'diabetes', 'heart disease',
        'arthritis', 'alzheimer', 'dementia',
        'depression', 'anxiety disorder',
        'covid', 'coronavirus', 'virus',
        'infection', 'bacterial', 'viral',
      ],
      treatmentClaims: [
        'heals', 'healing',
        'fixes', 'fixing',
        'eliminates disease',
        'reverses disease',
        'fights disease',
        'destroys',
        'kills disease',
      ],
      unsubstantiatedClaims: [
        'guaranteed results',
        'works for everyone',
        '100% effective',
        'miracle',
        'breakthrough cure',
        'revolutionary cure',
        'instant results',
        'permanent cure',
      ],
    };
  }

  /**
   * Initialize required disclaimers
   */
  initializeDisclaimers() {
    return {
      fda: '*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.',
      results: 'Individual results may vary.',
      medical: 'Consult your healthcare provider before use if you are pregnant, nursing, taking medications, or have a medical condition.',
      children: 'Keep out of reach of children.',
    };
  }

  /**
   * Validate content for compliance
   */
  validate(content) {
    const validation = {
      isCompliant: true,
      violations: [],
      warnings: [],
      score: 100,
    };

    // Check for disease claims
    const diseaseViolations = this.checkForTerms(content, this.prohibitedTerms.diseaseClaims, 'disease_claim');
    if (diseaseViolations.length > 0) {
      validation.isCompliant = false;
      validation.violations.push(...diseaseViolations);
      validation.score -= 30;
    }

    // Check for treatment claims
    const treatmentViolations = this.checkForTerms(content, this.prohibitedTerms.treatmentClaims, 'treatment_claim');
    if (treatmentViolations.length > 0) {
      validation.isCompliant = false;
      validation.violations.push(...treatmentViolations);
      validation.score -= 25;
    }

    // Check for unsubstantiated claims
    const unsubstantiatedWarnings = this.checkForTerms(content, this.prohibitedTerms.unsubstantiatedClaims, 'unsubstantiated_claim');
    if (unsubstantiatedWarnings.length > 0) {
      validation.warnings.push(...unsubstantiatedWarnings);
      validation.score -= 15;
    }

    // Check for required disclaimers
    if (!this.hasRequiredDisclaimer(content)) {
      validation.warnings.push({
        type: 'missing_disclaimer',
        message: 'Missing required FDA disclaimer',
        severity: 'high',
      });
      validation.score -= 10;
    }

    return validation;
  }

  /**
   * Check for prohibited terms in content
   */
  checkForTerms(content, terms, violationType) {
    const violations = [];
    const contentLower = content.toLowerCase();

    terms.forEach(term => {
      if (contentLower.includes(term.toLowerCase())) {
        violations.push({
          type: violationType,
          term,
          severity: violationType === 'disease_claim' || violationType === 'treatment_claim' ? 'critical' : 'medium',
          message: `Prohibited term detected: "${term}"`,
        });
      }
    });

    return violations;
  }

  /**
   * Check if content has required disclaimer
   */
  hasRequiredDisclaimer(content) {
    return content.includes('These statements have not been evaluated by the Food and Drug Administration');
  }

  /**
   * Revise content to be compliant
   */
  reviseContent(content) {
    let revised = content;

    // Replace prohibited terms with compliant alternatives
    const replacements = {
      'cure': 'support',
      'cures': 'supports',
      'treat': 'help maintain',
      'treats': 'helps maintain',
      'prevent disease': 'support wellness',
      'prevents disease': 'supports wellness',
      'fight disease': 'support immune function',
      'fights disease': 'supports immune function',
      'eliminate': 'help reduce',
      'eliminates': 'helps reduce',
      'guaranteed': 'designed to support',
      'miracle': 'effective',
    };

    for (const [prohibited, compliant] of Object.entries(replacements)) {
      const regex = new RegExp(prohibited, 'gi');
      revised = revised.replace(regex, compliant);
    }

    // Add FDA disclaimer if missing
    if (!this.hasRequiredDisclaimer(revised)) {
      revised += '\n\n' + this.requiredDisclaimers.fda;
    }

    return revised;
  }

  /**
   * Get compliant alternatives for a term
   */
  getCompliantAlternative(term) {
    const alternatives = {
      'cure': 'support',
      'treat': 'help maintain',
      'prevent': 'support',
      'fight': 'support',
      'eliminate': 'reduce',
      'guaranteed': 'designed to',
      'miracle': 'effective',
      'breakthrough': 'advanced',
    };

    return alternatives[term.toLowerCase()] || 'support';
  }

  /**
   * Generate compliant claim structure
   */
  generateCompliantClaim(benefit) {
    return {
      claim: `May support ${benefit}*`,
      disclaimer: this.requiredDisclaimers.fda,
      type: 'structure_function',
      compliant: true,
    };
  }

  /**
   * Validate testimonial for compliance
   */
  validateTestimonial(testimonial) {
    const validation = {
      isCompliant: true,
      issues: [],
    };

    // Check for disease/treatment claims in testimonial
    const diseaseTerms = ['cured', 'treated', 'healed', 'fixed my'];
    const testimonialLower = testimonial.toLowerCase();

    diseaseTerms.forEach(term => {
      if (testimonialLower.includes(term)) {
        validation.isCompliant = false;
        validation.issues.push({
          term,
          message: `Testimonial contains prohibited claim: "${term}"`,
          action: 'Remove or revise testimonial',
        });
      }
    });

    return validation;
  }

  /**
   * Get compliance checklist for content type
   */
  getComplianceChecklist(contentType) {
    const checklists = {
      product_page: [
        '✓ No disease claims (cure, treat, prevent)',
        '✓ Structure/function claims include asterisk (*)',
        '✓ FDA disclaimer present',
        '✓ Warnings and precautions included',
        '✓ Third-party testing mentioned',
        '✓ GMP certification displayed',
      ],
      advertisement: [
        '✓ No disease claims',
        '✓ No unsubstantiated claims',
        '✓ Disclaimer visible (if health claims)',
        '✓ No before/after medical claims',
        '✓ Testimonials include "results may vary"',
      ],
      email: [
        '✓ No disease claims',
        '✓ Unsubscribe link present',
        '✓ Disclaimer in footer',
        '✓ Compliant subject line',
      ],
      social_media: [
        '✓ No disease claims',
        '✓ Disclaimer in caption or comments',
        '✓ Hashtags don\'t imply medical claims',
      ],
    };

    return checklists[contentType] || checklists.product_page;
  }
}

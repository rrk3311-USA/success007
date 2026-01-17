/**
 * TRUST AGENT
 * Enforce compliance (no disease claims), add testimonials/disclaimers
 * Focus: FDA/FTC compliance, build trust, protect brand
 */

export class TrustAgent {
  constructor(db, compliance) {
    this.db = db;
    this.compliance = compliance;
  }

  /**
   * Validate content for compliance
   */
  async validate_compliance(params) {
    const { content } = params;
    
    const validation = {
      isCompliant: true,
      violations: [],
      warnings: [],
      suggestions: [],
      score: 100,
    };

    // Check for prohibited disease claims
    const diseaseViolations = this.checkDiseaseClaims(content);
    if (diseaseViolations.length > 0) {
      validation.isCompliant = false;
      validation.violations.push(...diseaseViolations);
      validation.score -= 30;
    }

    // Check for cure/treatment language
    const treatmentViolations = this.checkTreatmentClaims(content);
    if (treatmentViolations.length > 0) {
      validation.isCompliant = false;
      validation.violations.push(...treatmentViolations);
      validation.score -= 25;
    }

    // Check for required disclaimers
    const disclaimerWarnings = this.checkDisclaimers(content);
    if (disclaimerWarnings.length > 0) {
      validation.warnings.push(...disclaimerWarnings);
      validation.score -= 10;
    }

    // Check for unsubstantiated claims
    const unsubstantiatedClaims = this.checkUnsubstantiatedClaims(content);
    if (unsubstantiatedClaims.length > 0) {
      validation.warnings.push(...unsubstantiatedClaims);
      validation.score -= 15;
    }

    // Generate suggestions for improvement
    validation.suggestions = this.generateComplianceSuggestions(validation);

    return validation;
  }

  /**
   * Check for prohibited disease claims
   */
  checkDiseaseClaims(content) {
    const violations = [];
    const prohibitedTerms = [
      'cure', 'treat', 'prevent', 'diagnose', 'disease',
      'cancer', 'diabetes', 'heart disease', 'arthritis',
      'alzheimer', 'depression', 'anxiety disorder',
      'covid', 'coronavirus', 'infection', 'virus',
    ];

    const contentLower = content.toLowerCase();
    
    prohibitedTerms.forEach(term => {
      if (contentLower.includes(term)) {
        violations.push({
          type: 'disease_claim',
          term,
          severity: 'critical',
          message: `Prohibited disease claim detected: "${term}"`,
          regulation: 'FDA - Disease claims require drug approval',
        });
      }
    });

    return violations;
  }

  /**
   * Check for cure/treatment language
   */
  checkTreatmentClaims(content) {
    const violations = [];
    const prohibitedPhrases = [
      'cures',
      'treats',
      'heals',
      'fixes',
      'eliminates disease',
      'reverses',
      'prevents disease',
      'fights disease',
    ];

    const contentLower = content.toLowerCase();
    
    prohibitedPhrases.forEach(phrase => {
      if (contentLower.includes(phrase)) {
        violations.push({
          type: 'treatment_claim',
          phrase,
          severity: 'critical',
          message: `Prohibited treatment claim: "${phrase}"`,
          regulation: 'FTC - Unsubstantiated health claims',
        });
      }
    });

    return violations;
  }

  /**
   * Check for required disclaimers
   */
  checkDisclaimers(content) {
    const warnings = [];
    
    // Check for FDA disclaimer
    const hasFDADisclaimer = content.includes('These statements have not been evaluated by the Food and Drug Administration');
    if (!hasFDADisclaimer && this.hasHealthClaims(content)) {
      warnings.push({
        type: 'missing_disclaimer',
        severity: 'high',
        message: 'Missing required FDA disclaimer',
        required: '*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.',
      });
    }

    // Check for asterisks on claims
    const hasStructureFunctionClaims = this.hasStructureFunctionClaims(content);
    if (hasStructureFunctionClaims && !content.includes('*')) {
      warnings.push({
        type: 'missing_asterisk',
        severity: 'medium',
        message: 'Structure/function claims should include asterisk (*) referencing disclaimer',
      });
    }

    return warnings;
  }

  /**
   * Check for unsubstantiated claims
   */
  checkUnsubstantiatedClaims(content) {
    const warnings = [];
    const suspectPhrases = [
      'guaranteed results',
      'works for everyone',
      '100% effective',
      'miracle',
      'breakthrough',
      'revolutionary cure',
      'clinically proven' // Unless you have actual clinical trials
    ];

    const contentLower = content.toLowerCase();
    
    suspectPhrases.forEach(phrase => {
      if (contentLower.includes(phrase)) {
        warnings.push({
          type: 'unsubstantiated_claim',
          phrase,
          severity: 'medium',
          message: `Potentially unsubstantiated claim: "${phrase}"`,
          recommendation: 'Ensure you have scientific evidence to support this claim',
        });
      }
    });

    return warnings;
  }

  /**
   * Generate compliant testimonials section
   */
  async generate_testimonials() {
    return {
      title: 'What Our Customers Say',
      disclaimer: '**Disclaimer:** Individual results may vary. These testimonials reflect individual experiences and are not guarantees of results. Always consult your healthcare provider before starting any supplement regimen.',
      testimonials: [
        {
          text: 'Great quality product! Mixes well and no weird aftertaste. Been using for 3 months.',
          author: 'Mike T.',
          verified: true,
          date: '2024-01-15',
          compliant: true,
          note: 'Quality-focused, no health claims',
        },
        {
          text: 'Love the third-party testing. Gives me confidence in what I\'m putting in my body.',
          author: 'Sarah L.',
          verified: true,
          date: '2024-01-10',
          compliant: true,
          note: 'Trust and transparency focused',
        },
        {
          text: 'Fast shipping and excellent customer service. The subscription option is super convenient.',
          author: 'James R.',
          verified: true,
          date: '2024-01-08',
          compliant: true,
          note: 'Service-focused, no health claims',
        },
        {
          text: 'Clean ingredients, no fillers. This is exactly what I was looking for.',
          author: 'Emily K.',
          verified: true,
          date: '2024-01-05',
          compliant: true,
          note: 'Product quality focused',
        },
      ],
      guidelines: {
        acceptable: [
          'Product quality comments',
          'Taste, mixability, packaging feedback',
          'Customer service experiences',
          'Shipping and delivery comments',
          'Value and pricing feedback',
        ],
        prohibited: [
          'Disease treatment claims',
          'Cure or prevention claims',
          'Specific health outcome guarantees',
          'Before/after medical results',
          'Diagnostic claims',
        ],
      },
    };
  }

  /**
   * Generate trust badges and certifications
   */
  async generate_trust_badges() {
    return {
      badges: [
        {
          name: 'GMP Certified',
          description: 'Manufactured in a GMP-certified facility following strict quality standards',
          icon: 'gmp-badge.svg',
          verification: 'NSF International',
        },
        {
          name: 'Third-Party Tested',
          description: 'Independently tested for purity, potency, and contaminants',
          icon: 'tested-badge.svg',
          verification: 'ISO 17025 Accredited Lab',
        },
        {
          name: 'Money-Back Guarantee',
          description: '30-day satisfaction guarantee - no questions asked',
          icon: 'guarantee-badge.svg',
          verification: 'Company Policy',
        },
        {
          name: 'Made in USA',
          description: 'Proudly manufactured in the United States',
          icon: 'usa-badge.svg',
          verification: 'Domestic Manufacturing',
        },
        {
          name: 'No Artificial Ingredients',
          description: 'No artificial colors, flavors, or preservatives',
          icon: 'clean-badge.svg',
          verification: 'Product Formulation',
        },
      ],
      placement: [
        'Product pages - below price',
        'Homepage - trust section',
        'Checkout page - above payment',
        'Email footer',
      ],
    };
  }

  /**
   * Generate compliant product warnings
   */
  generateProductWarnings(productType) {
    const warnings = {
      general: [
        'Consult your healthcare provider before use if you are pregnant, nursing, taking medications, or have a medical condition.',
        'Keep out of reach of children.',
        'Do not exceed recommended dose.',
        'Store in a cool, dry place.',
      ],
      specific: {},
    };

    if (productType === 'caffeine' || productType === 'energy') {
      warnings.specific.caffeine = [
        'Contains caffeine. Not recommended for children, pregnant or nursing women, or individuals sensitive to caffeine.',
        'Do not consume within 6 hours of bedtime.',
        'Limit total caffeine intake from all sources.',
      ];
    }

    if (productType === 'creatine') {
      warnings.specific.creatine = [
        'Ensure adequate hydration when using creatine.',
        'Not recommended for individuals under 18 without medical supervision.',
      ];
    }

    return warnings;
  }

  /**
   * Generate compliance suggestions
   */
  generateComplianceSuggestions(validation) {
    const suggestions = [];

    if (validation.violations.length > 0) {
      suggestions.push({
        priority: 'critical',
        action: 'Remove all disease and treatment claims immediately',
        details: 'Replace with structure/function claims (e.g., "supports" instead of "treats")',
      });
    }

    if (validation.warnings.some(w => w.type === 'missing_disclaimer')) {
      suggestions.push({
        priority: 'high',
        action: 'Add FDA disclaimer to all marketing materials',
        details: 'Include: *These statements have not been evaluated by the FDA...',
      });
    }

    suggestions.push({
      priority: 'medium',
      action: 'Use compliant language patterns',
      details: 'Acceptable: "supports", "promotes", "helps maintain", "may support"',
    });

    suggestions.push({
      priority: 'low',
      action: 'Add trust elements',
      details: 'Include third-party testing, GMP certification, money-back guarantee',
    });

    return suggestions;
  }

  /**
   * Revise content to be compliant
   */
  reviseContent(content) {
    let revised = content;

    // Replace prohibited terms with compliant alternatives
    const replacements = {
      'cures': 'supports',
      'treats': 'helps maintain',
      'prevents disease': 'supports wellness',
      'fights disease': 'supports immune function',
      'eliminates': 'helps reduce',
      'guaranteed': 'designed to support',
    };

    for (const [prohibited, compliant] of Object.entries(replacements)) {
      const regex = new RegExp(prohibited, 'gi');
      revised = revised.replace(regex, compliant);
    }

    // Add asterisks to structure/function claims
    revised = revised.replace(/(supports|promotes|helps maintain|may support)([^*\n.]+)/gi, '$1$2*');

    // Add disclaimer if missing
    if (!revised.includes('These statements have not been evaluated')) {
      revised += '\n\n*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.';
    }

    return revised;
  }

  // Helper methods
  hasHealthClaims(content) {
    const healthTerms = ['supports', 'promotes', 'helps', 'maintains', 'enhances', 'boosts'];
    const contentLower = content.toLowerCase();
    return healthTerms.some(term => contentLower.includes(term));
  }

  hasStructureFunctionClaims(content) {
    const structureTerms = ['supports', 'promotes', 'helps maintain', 'may support'];
    const contentLower = content.toLowerCase();
    return structureTerms.some(term => contentLower.includes(term));
  }
}

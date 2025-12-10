'use strict';

/**
 * Enforce standard banner-style section headers and their order.
 *
 * It looks for single-line block comments like:
 * -------------------------------------------------------------------------- *
 *   Configurable Variables                                                   *
 * -------------------------------------------------------------------------- *
 *
 * and treats the middle line as the section name.
 */
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce section order in files',
      category: 'Stylistic Issues',
    },
    messages: {
      missingSection: 'Missing required section: "{{ name }}"',
      wrongOrder: 'Section "{{ current }}" appears before "{{ expected }}"',
    },
    schema: [],
  },
  create(context) {
    const options = context.options[0] || {};
    const requiredSections = options.sections || [
      'Response and error handling variables',
      'Configurable Variables',
      'Helper Functions',
      'MAIN CODE',
    ];

    const sourceCode = context.getSourceCode();

    function normalizeName(raw) {
      return raw.replace(/\s+/g, ' ').trim().toLowerCase();
    }

    return {
      Program() {
        const comments = sourceCode.getAllComments();

        const bannerSections = [];

        for (const comment of comments) {
          // Only consider single-line block comments
          if (comment.type !== 'Block') continue;

          const text = comment.value.trim();

          // Ignore multi-line blocks like big doc comments
          if (text.includes('\n')) continue;

          // Ignore the pure dashed lines like "------"
          if (/^-{5,}$/.test(text.replace(/\s+/g, ''))) continue;

          // At this point, it's a single-line block comment that is not just dashes.
          // We treat it as a potential section title.
          const normalized = normalizeName(text);
          bannerSections.push({
            rawName: text,
            normalizedName: normalized,
            node: comment,
          });
        }

        // Map required sections to normalized names for comparison
        const requiredNorm = requiredSections.map((s) => normalizeName(s));

        // Check required sections exist at least once
        for (let i = 0; i < requiredSections.length; i++) {
          const requiredName = requiredSections[i];
          const requiredNormName = requiredNorm[i];

          const exists = bannerSections.some(
            (s) => s.normalizedName === requiredNormName
          );

          if (!exists) {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'missingSection',
              data: { name: requiredName },
            });
          }
        }

        // Now enforce order based on first occurrence of each section
        // We walk through the file and expect sections in required order.
        let expectedIndex = 0;

        for (const section of bannerSections) {
          const idx = requiredNorm.indexOf(section.normalizedName);
          if (idx === -1) {
            // Not one of the required sections; ignore
            continue;
          }

          if (idx > expectedIndex) {
            // We skipped a required section
            const expectedName = requiredSections[expectedIndex];
            context.report({
              node: section.node,
              messageId: 'wrongOrder',
              data: {
                current: section.rawName.trim(),
                expected: expectedName,
              },
            });
          } else {
            expectedIndex = idx + 1;
          }
        }
      },
    };
  },
};

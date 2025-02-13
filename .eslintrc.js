module.exports = {
    extends: 'next/core-web-vitals',
    // Other configurations...
    overrides: [
        {
            files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
        },
    ],
    rules: {
        semi: ['error', 'always'],
        'no-console': 'warn',
        'react-hooks/exhaustive-deps': 'off',
    },
};

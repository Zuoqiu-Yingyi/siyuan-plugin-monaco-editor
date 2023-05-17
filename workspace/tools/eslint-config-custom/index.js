module.exports = {
    extends: [
        "turbo",
        "prettier",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-recommended",
        "plugin:svelte/recommended",
    ],
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint",
        "vue",
        "svelte3",
        "prettier",
    ],
    rules: {
    },
};

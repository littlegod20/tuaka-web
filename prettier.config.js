/** @type {import('prettier').Config} */
export default {
  // ─── Formatting ──────────────────────────────────
  printWidth:    100,      // wrap lines at 100 characters
  tabWidth:      2,        // 2 spaces per indent
  useTabs:       false,    // spaces, not tabs
  semi:          false,    // no semicolons
  singleQuote:   true,     // 'single quotes' not "double quotes"
  trailingComma: 'all',    // trailing commas everywhere valid
  bracketSpacing:    true, // { foo: bar } not {foo: bar}
  bracketSameLine:   false, // JSX closing > on its own line
  arrowParens:   'always', // (x) => x  not  x => x

  // ─── Import sorting ──────────────────────────────
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^react$',                    // 1. React first
    '^react-(.*)$',               // 2. React ecosystem (react-router etc)
    '^@tanstack/(.*)$',           // 3. TanStack (react-query etc)
    '<THIRD_PARTY_MODULES>',      // 4. All other external packages
    '^@tuaka/(.*)$',              // 5. Internal workspace packages
    '^@/(.*)$',                   // 6. Path aliased imports (@/components etc)
    '^[./]',                      // 7. Relative imports last
  ],
  importOrderSeparation: true,    // blank line between each group
  importOrderSortSpecifiers: true, // sort named imports alphabetically
}

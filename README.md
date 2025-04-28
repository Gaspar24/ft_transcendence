# ft_transcendence

## how to run

```
cd ./frontend
npm install
npm run dev

cd ./backend
npm install
npm run dev2
```


--------------------------------------------------------

Inline Styles: Styles applied directly using the style prop in React (e.g., <div style={{ color: 'red' }}>) have the highest specificity and will override almost anything else. (You are not currently using these in Game.tsx).
Specificity of Selectors: More specific CSS selectors override less specific ones.
An ID selector (#myElement) is more specific than a class selector (.myClass).
A class selector is more specific than an element selector (div).
Tailwind utility classes (like .border, .border-black, .flex) often translate to fairly specific CSS rules.
Order in Stylesheet: If two rules have the same specificity, the one that appears later in the final compiled CSS file wins.
Because @import "tailwindcss"; is at the top of your index.css, the custom rules you define below it (like .game-container) could potentially override Tailwind's base styles if they target the same properties with the same specificity.
However, when you apply Tailwind utility classes directly to an element (className="border"), those specific utility rules often take precedence over more general custom rules defined in index.css due to specificity or Tailwind's internal processing order.
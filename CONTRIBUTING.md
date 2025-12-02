# Contributing to Gamified Habit Tracker

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 🚀 Getting Started

### Development Environment Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Gamified.git
   cd Gamified/app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example file and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Start development servers**
   ```bash
   # Terminal 1: Convex backend
   npx convex dev
   
   # Terminal 2: Next.js frontend
   npm run dev
   ```

## 📝 Code Style

### TypeScript
- Use TypeScript for all new files
- Avoid `any` types - use proper type definitions
- Use interfaces for object shapes
- Export types that are used across files

### React Components
- Use functional components with hooks
- Use `"use client"` directive for client components
- Keep components focused and single-responsibility
- Extract reusable logic into custom hooks

### Naming Conventions
- **Files**: PascalCase for components (`HabitList.tsx`), camelCase for utilities (`utils.ts`)
- **Components**: PascalCase (`function HabitList()`)
- **Variables/Functions**: camelCase (`const handleClick`)
- **Constants**: UPPER_SNAKE_CASE (`const MAX_LEVEL = 100`)
- **Convex Functions**: camelCase (`export const getTodaySessions`)

### File Organization
```
components/
├── features/          # Feature-specific components
│   └── habits/
│       ├── HabitList.tsx       # Main component
│       ├── CreateHabitForm.tsx # Sub-component
│       └── index.ts            # Exports
├── ui/                # Reusable UI components
└── layout/            # Layout components
```

## 🎯 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
git commit -m "feat(habits): add habit editing functionality"
git commit -m "fix(pomodoro): correct XP calculation for custom durations"
git commit -m "docs(readme): update installation instructions"
```

## 🔄 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add comments for complex logic
   - Update tests if applicable

3. **Test your changes**
   ```bash
   npm run build  # Ensure build succeeds
   npm run lint   # Check for linting errors
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feat/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your feature branch
   - Fill out the PR template with:
     - Description of changes
     - Related issue number (if applicable)
     - Screenshots (for UI changes)
     - Testing steps

### PR Checklist
- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated (if needed)
- [ ] No new warnings or errors
- [ ] Build succeeds (`npm run build`)
- [ ] Tested locally

## 🐛 Reporting Bugs

### Before Submitting
- Check if the bug has already been reported
- Confirm the bug exists in the latest version
- Collect relevant information

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 20.10.0]

**Additional context**
Any other relevant information.
```

## 💡 Feature Requests

We welcome feature ideas! Please:
1. Check if the feature has already been requested
2. Clearly describe the feature and its benefits
3. Provide examples or mockups if possible
4. Explain the use case

## 🏗️ Architecture Guidelines

### Convex Backend
- Keep mutations focused (single responsibility)
- Use proper indexing for queries
- Validate inputs in mutation handlers
- Handle errors gracefully

### State Management
- Use Convex queries/mutations for server state
- Use React state for UI-only state
- Avoid prop drilling - use context when needed

### Component Design
- Keep components small and focused
- Extract shared logic to custom hooks
- Use composition over inheritance
- Make components reusable

## 🧪 Testing (Future)

We plan to add comprehensive testing. When contributing tests:
- Write meaningful test descriptions
- Test edge cases
- Mock external dependencies
- Keep tests fast and isolated

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## ❓ Questions?

If you have questions:
1. Check existing issues and discussions
2. Review the documentation
3. Ask in GitHub Discussions
4. Open an issue with the `question` label

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

Thank you for contributing to make Gamified Habit Tracker better! 🎉

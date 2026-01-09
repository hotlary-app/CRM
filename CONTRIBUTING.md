# Contributing to Hotlary CRM

Thank you for your interest in contributing to Hotlary CRM! This document provides guidelines and instructions for contributing to our project. Whether you're fixing bugs, adding features, or improving documentation, we appreciate your effort.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation Guidelines](#documentation-guidelines)

---

## Code of Conduct

### Our Commitment

We are committed to providing a welcoming and inclusive environment for all contributors. We expect all participants to adhere to the following principles:

#### Be Respectful
- Treat all community members with respect and courtesy
- Value diverse perspectives and experiences
- Avoid discriminatory language and behavior

#### Be Collaborative
- Work constructively with others
- Accept constructive criticism gracefully
- Focus on what's best for the community

#### Be Professional
- Keep discussions focused on the project
- Avoid harassment, abuse, or insulting language
- Report inappropriate behavior to the maintainers

#### Be Inclusive
- Welcome contributors of all backgrounds
- Provide accessible communication and documentation
- Help new contributors get up to speed

### Enforcement

Violations of the Code of Conduct will be taken seriously. Maintainers may:
- Request changes to inappropriate behavior
- Temporarily or permanently ban contributors
- Report serious incidents to appropriate authorities

For concerns, please contact the maintainers privately.

---

## Getting Started

### Prerequisites

- **Git**: Version 2.25 or higher
- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher
- A GitHub account

### Fork and Clone

1. Fork the repository by clicking the "Fork" button on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CRM.git
   cd CRM
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/hotlary-app/CRM.git
   ```

### Create a Working Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

---

## Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the project root:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
# Add other required environment variables
```

### 3. Start Development Server

```bash
npm start
```

The application should be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

### 5. Run Tests

```bash
npm test
```

### 6. Lint Code

```bash
npm run lint
```

---

## Coding Standards

### General Principles

- Write clean, readable, and maintainable code
- Follow the DRY (Don't Repeat Yourself) principle
- Use meaningful variable and function names
- Keep functions small and focused
- Avoid deep nesting; prefer early returns

### JavaScript/TypeScript Standards

#### Naming Conventions

```javascript
// Constants - UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';

// Variables & Functions - camelCase
const userName = 'John';
function calculateTotal() { }

// Classes & Components - PascalCase
class UserService { }
function UserProfile() { }

// Private members - prefix with underscore (or use # for private fields)
class MyClass {
  #privateField = null;
  _internalMethod() { }
}
```

#### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings (except in JSX attributes)
- Use semicolons at the end of statements
- Use `const` by default, `let` when needed, avoid `var`
- Use arrow functions for anonymous functions
- Add comments for complex logic

```javascript
// ✅ Good
const calculateTax = (amount, rate) => {
  return amount * rate;
};

// ❌ Avoid
var calculateTax = function(amount, rate) {
  return amount * rate;
}

// Add comments for non-obvious logic
const parseUserData = (data) => {
  // Convert API response format to internal format
  return {
    id: data.user_id,
    name: data.full_name,
  };
};
```

### React Component Standards

```javascript
// Use functional components with hooks
function UserCard({ user, onDelete }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteUser(user.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      <button onClick={handleDelete} disabled={isLoading}>
        {isLoading ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}

export default UserCard;
```

#### Component Best Practices

- Keep components small and focused
- Extract reusable logic into custom hooks
- Use prop destructuring
- Document prop types with PropTypes or TypeScript
- Use CSS modules or styled-components for styling

### CSS Standards

- Use CSS modules or BEM naming convention
- Avoid inline styles
- Mobile-first responsive design
- Use CSS variables for theming

```css
/* ✅ Good - CSS Module or BEM */
.user-card {
  padding: 16px;
  border-radius: 8px;
}

.user-card__title {
  font-size: 18px;
  font-weight: bold;
}

.user-card__button {
  padding: 8px 12px;
  background-color: var(--primary-color);
}
```

### ESLint and Prettier

The project uses ESLint and Prettier for code quality. Run before committing:

```bash
npm run lint -- --fix
npm run format
```

---

## Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for clear, semantic commit messages.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code logic (formatting, missing semicolons, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process, dependencies, or tooling

### Examples

```bash
# Feature
git commit -m "feat(auth): add two-factor authentication"

# Bug fix
git commit -m "fix(user): resolve profile page loading error"

# With detailed body
git commit -m "feat(dashboard): add sales analytics widget

- Implement real-time sales data visualization
- Add date range filter
- Include export to CSV functionality

Closes #123"

# Documentation
git commit -m "docs: update API authentication guide"

# Refactoring
git commit -m "refactor(api): simplify error handling middleware"
```

### Rules

- Use imperative mood ("add feature" not "added feature")
- Don't capitalize the first letter of the subject
- Don't end the subject with a period
- Limit the subject line to 50 characters
- Wrap the body at 72 characters
- Reference issues and PRs in the footer

---

## Pull Request Process

### Before Submitting

1. **Keep commits organized**: Squash related commits or keep them logically separated
2. **Stay updated**: Sync your branch with the latest upstream changes
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
3. **Run tests locally**: Ensure all tests pass
   ```bash
   npm test
   ```
4. **Check code quality**: Run linting and formatting
   ```bash
   npm run lint -- --fix
   npm run format
   ```
5. **Build for production**: Verify the build succeeds
   ```bash
   npm run build
   ```

### Creating a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a pull request on GitHub with:
   - **Clear title**: Summarize the change (e.g., "Add email verification")
   - **Description**: Explain what you changed and why
   - **Related issues**: Link to any related issues (e.g., "Closes #123")
   - **Screenshots/videos**: For UI changes, include visual evidence

### PR Description Template

```markdown
## Description
Brief explanation of what this PR does.

## Related Issues
Closes #123
Relates to #456

## Changes
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed my own code
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

### Review Process

- Respond to feedback promptly
- Request re-review after making changes
- Be open to suggestions and alternative approaches
- Thank reviewers for their time

### Approval and Merge

- At least one approval from a maintainer is required
- All CI checks must pass
- No merge conflicts should exist
- Maintainers will handle the merge

---

## Testing Requirements

### Test Coverage

- Aim for 80%+ test coverage on new code
- Critical paths should have 100% coverage
- All bug fixes should include regression tests

### Writing Tests

```javascript
// ✅ Good - Clear test structure
describe('UserService', () => {
  describe('getUser', () => {
    it('should return user by ID', async () => {
      const user = await userService.getUser(1);
      
      expect(user).toBeDefined();
      expect(user.id).toBe(1);
    });

    it('should throw error for invalid ID', async () => {
      await expect(userService.getUser(-1)).rejects.toThrow();
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- UserService.test.js
```

### Types of Tests

#### Unit Tests
- Test individual functions and components
- Mock external dependencies
- Fast execution

#### Integration Tests
- Test multiple components working together
- Use real or realistic data
- Test API interactions

#### End-to-End Tests
- Test complete user workflows
- Run against a full application instance
- Most time-consuming

### Test Best Practices

- Write tests as you write code
- Use descriptive test names
- Test behavior, not implementation
- Avoid testing third-party libraries
- Keep tests isolated and independent
- Use appropriate assertion libraries

---

## Documentation Guidelines

### Code Documentation

#### JSDoc Comments

```javascript
/**
 * Calculates the total price including tax.
 * 
 * @param {number} basePrice - The base price before tax
 * @param {number} taxRate - The tax rate as a decimal (e.g., 0.1 for 10%)
 * @returns {number} The total price including tax
 * @throws {Error} If price or tax rate is negative
 * 
 * @example
 * const total = calculateTotal(100, 0.1); // returns 110
 */
function calculateTotal(basePrice, taxRate) {
  if (basePrice < 0 || taxRate < 0) {
    throw new Error('Price and tax rate must be non-negative');
  }
  return basePrice * (1 + taxRate);
}
```

#### Component Documentation

```javascript
/**
 * UserProfile - Displays user information and provides edit capabilities
 * 
 * @component
 * @param {Object} props - Component props
 * @param {number} props.userId - The ID of the user to display
 * @param {Function} props.onUpdate - Callback when user data is updated
 * @returns {React.ReactElement}
 * 
 * @example
 * <UserProfile userId={123} onUpdate={handleUpdate} />
 */
function UserProfile({ userId, onUpdate }) {
  // Component implementation
}
```

### README Updates

- Update README.md if your changes affect setup or usage
- Keep it clear and concise
- Include relevant examples

### Changelog

- Document breaking changes
- Include new features
- Note bug fixes
- Follow [Keep a Changelog](https://keepachangelog.com/) format

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error responses
- Keep API docs in sync with implementation

```markdown
## GET /api/users/:id

Retrieves a user by ID.

### Parameters
- `id` (required): User ID

### Response
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Errors
- `404 Not Found`: User does not exist
- `500 Internal Server Error`: Server error
```

---

## Additional Resources

- [Project README](./README.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [License](./LICENSE)
- [Issue Tracker](https://github.com/hotlary-app/CRM/issues)

---

## Getting Help

- **Questions**: Open a discussion or ask in issues
- **Bugs**: Report in the issue tracker with reproduction steps
- **Security**: Do NOT open public issues for security vulnerabilities. Email maintainers privately.

---

## Thank You!

Your contributions make Hotlary CRM better for everyone. We appreciate your time and effort!

For questions or discussions, please reach out to the maintainers through GitHub issues or pull request comments.

Happy coding! 🚀

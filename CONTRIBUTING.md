# Contributing to Kallcast

Thank you for your interest in contributing to Kallcast! We welcome contributions from the community and are excited to see what you'll bring to the project.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git
- MongoDB (local or cloud)
- Stripe account (for payment testing)
- Daily.co account (for video features)

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/kallcast.git
   cd kallcast
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🎯 How to Contribute

### Reporting Bugs
1. Check if the bug has already been reported in [Issues](https://github.com/gbabudoh/kallcast/issues)
2. If not, create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, browser, Node version)

### Suggesting Features
1. Check [Discussions](https://github.com/gbabudoh/kallcast/discussions) for existing feature requests
2. Create a new discussion with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach
   - Mockups or examples (if applicable)

### Code Contributions

#### Branch Naming Convention
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Adding tests

#### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add social login with Google
fix(dashboard): resolve stats loading issue
docs(readme): update installation instructions
```

#### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   npm run test
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): your descriptive message"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all checks pass

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused

### Component Guidelines
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow the existing component structure
- Use Tailwind CSS for styling
- Ensure components are responsive

### API Guidelines
- Use proper HTTP status codes
- Implement error handling
- Add input validation with Zod
- Follow RESTful conventions
- Document API endpoints

### Database Guidelines
- Use Mongoose for MongoDB operations
- Implement proper indexing
- Add validation at the schema level
- Use transactions for complex operations
- Follow naming conventions

## 🧪 Testing

### Running Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Writing Tests
- Write unit tests for utilities and hooks
- Write integration tests for API routes
- Write component tests for UI components
- Use meaningful test descriptions
- Mock external dependencies

### Test Structure
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interaction', () => {
    // Test implementation
  });
});
```

## 🎨 UI/UX Guidelines

### Design Principles
- **Consistency**: Use the established design system
- **Accessibility**: Ensure WCAG 2.1 AA compliance
- **Performance**: Optimize for fast loading
- **Mobile-First**: Design for mobile, enhance for desktop

### Color Palette
- Primary: Blue to Purple gradients
- Secondary: Indigo variations
- Success: Green tones
- Warning: Orange tones
- Error: Red tones

### Typography
- Use the Geist font family
- Maintain proper heading hierarchy
- Ensure good contrast ratios
- Use consistent spacing

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex algorithms
- Explain business logic
- Update README for new features

### API Documentation
- Document all endpoints
- Include request/response examples
- Specify required parameters
- Document error responses

## 🔍 Code Review Process

### For Contributors
- Ensure your code follows the guidelines
- Write clear commit messages
- Add tests for new functionality
- Update documentation as needed

### For Reviewers
- Check code quality and style
- Verify functionality works as expected
- Ensure tests are adequate
- Provide constructive feedback

## 🏷️ Release Process

### Versioning
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version bumped
- [ ] Tagged release created

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the issue, not the person
- Help others learn and grow

### Communication
- Use clear and concise language
- Be patient with questions
- Share knowledge and resources
- Celebrate contributions

## 📞 Getting Help

### Resources
- [GitHub Discussions](https://github.com/gbabudoh/kallcast/discussions)
- [Documentation](https://docs.kallcast.com)
- [Issue Tracker](https://github.com/gbabudoh/kallcast/issues)

### Contact
- Email: developers@kallcast.com
- Discord: [Kallcast Community](https://discord.gg/kallcast)

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Community highlights
- Annual contributor awards

Thank you for contributing to Kallcast! 🎉
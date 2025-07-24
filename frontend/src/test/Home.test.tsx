import { render, screen } from '@testing-library/react';
import HomePage from '../pages/HomePage';

describe('HomePage', () => {
    it('should render the welcome message', () => {
        render(<HomePage />);
        expect(screen.getByText('Welcome to Code Duel!')).toBeInTheDocument();
    });
});

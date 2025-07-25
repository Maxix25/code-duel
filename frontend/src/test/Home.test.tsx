import { render, screen } from '@testing-library/react';
import HomePage from '../pages/HomePage';

describe('HomePage', () => {
    beforeEach(() => {
        const mockIntersectionObserver = vi.fn();
        mockIntersectionObserver.mockReturnValue({
            observe: () => null,
            unobserve: () => null,
            disconnect: () => null
        });
        window.IntersectionObserver = mockIntersectionObserver;
    });
    it('should render the welcome message', () => {
        render(<HomePage />);
        expect(screen.getByText('Welcome to Code Duel')).toBeInTheDocument();
    });
});

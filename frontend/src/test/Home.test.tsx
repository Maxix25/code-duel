import { render, screen } from '@testing-library/react';
import HomePage from '../pages/HomePage';

describe('HomePage', () => {
    beforeEach(() => {
        window.IntersectionObserver = vi.fn().mockImplementation(function () {
            return {
                observe: vi.fn(),
                unobserve: vi.fn(),
                disconnect: vi.fn()
            };
        });
    });

    it('should render the welcome message', () => {
        render(<HomePage />);
        expect(screen.getByText('Welcome to Code Duel')).toBeTruthy();
    });
});

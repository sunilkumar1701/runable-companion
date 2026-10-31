import { Sparkle } from 'lucide-react';
import { USER_NAME } from '../../data/demoData';
import './WelcomeSection.css';

/**
 * Welcome greeting section with sparkle icon, heading, and supporting text.
 */
export default function WelcomeSection() {
  return (
    <section className="welcome" aria-label="Welcome greeting">
      <Sparkle
        size={28}
        strokeWidth={1.5}
        className="welcome-sparkle"
      />
      <h1 className="welcome-heading">Good afternoon, {USER_NAME}</h1>
      <p className="welcome-subtext">How can Runable help you today?</p>
    </section>
  );
}


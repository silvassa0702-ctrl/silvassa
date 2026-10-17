import { useNavigate } from 'react-router-dom';
import OurStoryPage from '../components/OurStoryPage';

export default function StoryPage() {
  const navigate = useNavigate();
  return (
    <OurStoryPage
      onBack={() => {
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      onGoFeedback={() => {
        navigate('/feedback');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  );
}

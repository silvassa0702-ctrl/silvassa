import { useNavigate } from 'react-router-dom';
import FeedbackPage from '../components/FeedbackPage';

export default function PublicFeedbackPage() {
  const navigate = useNavigate();
  return (
    <FeedbackPage
      onBack={() => {
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  );
}

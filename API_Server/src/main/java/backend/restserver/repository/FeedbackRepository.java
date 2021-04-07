package backend.restserver.repository;

import backend.restserver.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Feedback findByFeedbackUserId(String feedbackUserId);
}

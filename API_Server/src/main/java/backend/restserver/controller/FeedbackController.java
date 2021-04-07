package backend.restserver.controller;

import backend.restserver.entity.Feedback;
import backend.restserver.entity.User;
import backend.restserver.repository.FeedbackRepository;
import backend.restserver.repository.UserRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class FeedbackController {
    private final FeedbackRepository feedbackRepo;
    private final UserRepository userRepo;

    public FeedbackController(FeedbackRepository feedbackRepository, UserRepository userRepository) {
        this.feedbackRepo = feedbackRepository;
        this.userRepo = userRepository;
    }

    @PostMapping("/api/feedback")
    public Feedback saveFeedback(@RequestBody Map<String, Object> feedbackJson) {
        String feedbackUserId = feedbackJson.get("userId").toString();
        String feedbackFeedback = feedbackJson.get("text").toString();
        User user = userRepo.findByUserId(feedbackUserId);

        return  feedbackRepo.save(Feedback.builder().
                feedbackUserId(feedbackUserId).
                feedbackEmail(user.getEmail()).
                feedbackUsername(user.getUsername()).
                feedbackFeedback(feedbackFeedback).build());
    }
}
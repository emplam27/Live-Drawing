package backend.restserver.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "feedback")
@NoArgsConstructor
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedbackPk")
    private Long feedbackPk;

    @Column(name = "feedbackDate")
    @CreationTimestamp
    private Timestamp feedbackDate;

    @Column(name = "feedbackUsername")
    private String feedbackUsername;

    @Column(name = "feedbackUserId")
    private String feedbackUserId;

    @Column(name = "feedbackEmail")
    private String feedbackEmail;

    @Lob
    @Column(name = "feedbackFeedback")
    private String feedbackFeedback;

    @Builder
    public Feedback(Timestamp feedbackDate,
                    String feedbackUsername,
                    String feedbackUserId,
                    String feedbackEmail,
                    String feedbackFeedback) {
        this.feedbackDate = feedbackDate;
        this.feedbackUsername = feedbackUsername;
        this.feedbackUserId = feedbackUserId;
        this.feedbackEmail = feedbackEmail;
        this.feedbackFeedback = feedbackFeedback;
    }
}

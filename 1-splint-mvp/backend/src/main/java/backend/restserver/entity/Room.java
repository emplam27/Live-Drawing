package backend.restserver.entity;

import lombok.Builder;
import lombok.Getter;

import javax.persistence.*;
import java.util.Optional;

@Getter
@Entity
@Table(name = "room")
@NamedQuery(
    name = "Room.findByTitle",
    query = "select a from Room a where a.title = :title"
)
public class Room {
    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "`key`")
    private Long key;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Room() {
    }

    public Room(String title, Long key, User user) {
        this.title = title;
        this.key = key;
        this.user = user;
    }
}

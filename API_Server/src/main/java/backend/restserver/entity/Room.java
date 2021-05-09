package backend.restserver.entity;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Data
@Entity
@Table(name = "room")
@NoArgsConstructor
public class Room {
    @Id
    @GeneratedValue()
    @Column(name = "roomPk")
    private Long roomPk;

    @Column(name = "roomTitle")
    private String roomTitle;

    @Column(name = "roomId")
    private String roomId; // uuid

    @Column(name = "roomHostname")
    private String roomHostname;

    @Column(name = "roomPassword")
    private String roomPassword;

    @Column(name = "roomHostId")
    private String roomHostId;

    @Column(name = "roomActive")
    private boolean roomActive;

    public Room(String roomTitle, String roomId, String roomHostId) {
        this.roomTitle = roomTitle;
        this.roomId = roomId;
        this.roomHostId = roomHostId;
//        this.members = members;
    }

    public Room(String roomTitle, String roomId, String roomPassword, String roomHostId, String roomHostname, boolean roomActive) {
        this.roomTitle = roomTitle;
        this.roomId = roomId;
        this.roomPassword = roomPassword;
        this.roomHostId = roomHostId;
        this.roomHostname = roomHostname;
        this.roomActive = roomActive;
    }

    public void add(User user) {
        user.setRoom(this);
//        getMembers().add(member);
    }

}

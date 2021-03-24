package backend.restserver.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "member")
public class Member {
    @Id
    @GeneratedValue
//    @Column(name="memberPk")
    private Long memberPk;
//    @Column(name="memberName")
    private String memberName;


//    @OneToOne(mappedBy = "user")
//    private Room room;\
    @ManyToOne
    @JoinColumn(name = "room_pk")
    private Room room;

    public Member() {}

    public Member(String memberName) {
        this.memberName = memberName;
    }

    public Member(String memberName, Room room) {
        this.memberName = memberName;
        this.room = room;
    }

//    public User(String name, Room room) {
//        this.name = name;
//        this.room = room;
//    }
}


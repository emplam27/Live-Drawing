package backend.restserver.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "user")
@NoArgsConstructor
public class User {
    @Id // primary key
    @GeneratedValue
    @Column(name="userPk")
    private Long userPk;
    @Column(name="username")
    private String username;
    @Column(name="password")
    private String password;
    @Column(name="email")
    private String email;
    @Column(name="role")
    private String role; //ROLE_USER, ROLE_ADMIN, ROLE_MANAGER

//    private Timestamp loginDate; // 얘는 로그인할때마다 저장된다. 근데 지금은 안한다. (1년뒤 만료되는거를 고려하기위해 넣어줌)

    private String provider;
    private String providerId;


    @CreationTimestamp
    private Timestamp createDate;



//    @OneToOne(mappedBy = "user")
//    private Room room;\
    @ManyToOne
    @JoinColumn(name = "roomPk")
    private Room room;

//    public User() {}

    public User(String username) {
        this.username = username;
    }

    public User(String username, Room room) {
        this.username = username;
        this.room = room;
    }

    @Builder
    public User(String username, String password, String email, String role, String provider, String providerId, Timestamp createDate) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.provider = provider;
        this.providerId = providerId;
        this.createDate = createDate;
    }

    //    public User(String name, Room room) {
//        this.name = name;
//        this.room = room;
//    }
}


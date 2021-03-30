package backend.restserver.repository;

import backend.restserver.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

//* CRUD 함수를 JpaRepository가 들고있음.
//* @Repository라는 어노테이션이 없어도 IoC가 된다. 이유는 JpaRepository를 상속했기 때문

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByRoom_RoomPk(Long roomPk);

    // findBy 규칙 -> UserName 문법
    // select * from user where userName = 1?
    public User findByUsername(String username); //* Jpa Query Methods (쿼리 메소드)를 공식홈페이지에서 찾아보면 됨.
    User findByEmail(String email);
    //! 근데 얘는 왜 public을 붙이지?
}

package backend.restserver.repository;

import backend.restserver.entity.Room;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.persistence.EntityManager;
import java.lang.reflect.Member;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {


//    private EntityManager entityManager;

    List<Room> findByRoomId(String roomId);

//    @Override
//    List<Room> findOrderedByRoomPkLimitedTo(int limit) {
//        return entityManager.createQuery("SELECT p FROM Room p ORDER BY p.roomPk",
//                Room.class).setMaxResults(limit).getResultList();
//    }

    List<Room> findAllOrderByRoomPk(Long roomPk);

}

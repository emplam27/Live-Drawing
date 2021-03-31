import React, { useEffect } from 'react';
import '../index.css';
import { ClosedFilterComponentProps } from '../interfaces/closed-filter-interfaces';
import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

function ClosedFilterComponent(props: ClosedFilterComponentProps) {
  useEffect(() => {
    if (!props.isLiveClosed) return;
    Swal.fire({
      title: '라이브가 종료되었습니다.',
      text: '홈 화면으로 이동합니다.',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: '  이동(사실은 안감)',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('홈 화면으로 이동하는 로직이 들어감');
        props.setIsLiveClosed(false);
      }
    });
  }, [props.isLiveClosed]);

  return <></>;
}

export default ClosedFilterComponent;

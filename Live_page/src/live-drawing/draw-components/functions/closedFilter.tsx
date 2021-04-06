import React from 'react';
import { ClosedFilter } from '../interfaces/closed-filter-interfaces';
import Swal from 'sweetalert2';
import '../index.css';

export function closedFilter({ isLiveClosed, setIsLiveClosed }: ClosedFilter) {
  if (!isLiveClosed) return;
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
      setIsLiveClosed(false);
    }
  });
}

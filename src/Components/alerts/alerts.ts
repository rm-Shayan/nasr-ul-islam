import Swal from 'sweetalert2';

export const showSuccess = ({ title, text }: { title: string; text: string }) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
  });
};


export const showError = ({ title, text }: { title: string; text: string }) => {
  return Swal.fire({
    icon: 'error', // ✅ Correct spelling
    title,
    text,
  });
};


const Icon = ({ name, ...props }) => {
  const paths = {
    arrow: <path d='M7 17 17 7M7 7h10v10' />,
    download: <path d='M12 3v12m-4-4 4 4 4-4M5 16v5h14v-5' />,
    share: <path d='M12 16V3m-4 4 4-4 4 4M5 12v9h14v-9' />,
    search: (
      <>
        <circle cx='10.5' cy='10.5' r='6.5' />
        <path d='m16 16 5 5' />
      </>
    ),
    pin: (
      <>
        <path d='M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z' />
        <circle cx='12' cy='10' r='2' />
      </>
    ),
    chevron: <path d='m6 9 6 6 6-6' />,
  };

  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      {...props}
    >
      {paths[name]}
    </svg>
  );
};

export default Icon;

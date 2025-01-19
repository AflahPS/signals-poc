export const globalSx = {
  tableContainerSx: {
    width: '100%',
    minHeight: '720px',
    height: '780px',
    overflowY: 'auto',
  },
  tableSx: {
    fontSize: 15,
    boxShadow: 2,
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold',
      color: 'text',
    },
    minHeight: '620px',
  },
  inputLabel: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 500,
  },
  buttonStyles: {
    textTransform: 'none',
    p: '10px 36px',
    fontWeight: 500,
    fontSize: '16px',
    borderRadius: '8px',
  },
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '100vw', md: '50vw' },
    height: { xs: '100vh', md: 'auto' },
    boxShadow: 24,
    borderRadius: '6px',
    px: { xs: '16px', md: '54px' },
    py: { xs: '16px', md: '40px' },
  },
  titleStyles: { fontSize: '20px', fontWeight: 500, lineHeight: '30px' },
  modalContainerStack: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    pb: '16px',
  },
};

import React, { useState, useCallback, useEffect } from 'react';
import {
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  Card,
  Typography,
  TextField,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { getRequest } from '../../services/httpService';
import useStyles from './ArticlesStyles';
import ArticleEditorDialog from './ArticleEditorDialog';
import ConfirmationDialog from '../UI/ConfirmationDialog';

const Articles = (props) => {
  const classes = useStyles();

  const [articles, setArticles] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [search, setSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [shouldOpenEditorDialog, setShouldOpenEditorDialog] = useState(false);
  const [shouldOpenDeleteDialog, setShouldOpenDeleteDialog] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);

  useEffect(() => {
    onFetchArticles();
  }, []);

  const onFetchArticles = useCallback(async () => {
    const result = await getRequest('/articles');
    if (result.status === 200) {
      setArticles(result.data);
    }
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  const onCreateArticle = () => {
    setCurrentArticle(null);
    setShouldOpenEditorDialog(true);
  };

  const onEditArticle = (article) => {
    setCurrentArticle(article);
    setShouldOpenEditorDialog(true);
  };

  const onDeleteArticle = (event, article) => {
    event.stopPropagation();
    setCurrentArticle(article);
    setShouldOpenDeleteDialog(true);
  };

  const handleDialogClose = (type) => {
    if (type !== undefined) {
      setSuccessMessage(
        type === 'create'
          ? 'Artiklot e uspeshno kreiran!'
          : 'Artiklot e uspeshno promenet!'
      );
      setOpenSnackbar(true);
      onFetchArticles();
    }
    setShouldOpenEditorDialog(false);
  };

  const handleDeleteDialogClose = () => {
    onFetchArticles();
    setShouldOpenDeleteDialog(false);
  };

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <div className={classes.container}>
      <Typography variant='h5' className={classes.title}>
        Artikli
      </Typography>
      <div className={classes.searchContainer}>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => onCreateArticle()}
        >
          Kreiraj Nov Artikal
        </Button>

        <form noValidate autoComplete='off'>
          <TextField
            id='filter-articles'
            label='Search Articles'
            fullWidth
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </form>
      </div>

      {articles.length === 0 ? (
        <Typography variant='h6' style={{ marginTop: 30 }}>
          Ne se pronajdeni artikli vo databazata.
        </Typography>
      ) : (
        <Card className={classes.card} elevation={6}>
          <Table
            style={{ whiteSpace: 'pre', minWidth: '750px' }}
            stickyHeader={true}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant='subtitle2'>Shifra</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Ime</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Edinecna Merka</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>
                    Tarifen broj (DDV)
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Mak. Proizvod</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Cena</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>Korekcija</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles
                .filter(
                  (article) =>
                    article.shifra
                      .toLowerCase()
                      .indexOf(search.toLowerCase()) !== -1 ||
                    article.ime.toLowerCase().indexOf(search.toLowerCase()) !==
                      -1
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((article, index) => (
                  <TableRow
                    key={article.shifra}
                    className={classes.tableRow}
                    onClick={() => onEditArticle(article)}
                  >
                    <TableCell align='left'>{article.shifra}</TableCell>
                    <TableCell
                      align='left'
                      style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                    >
                      {article.ime}
                    </TableCell>
                    <TableCell align='left'>{article.edinecna_merka}</TableCell>
                    <TableCell align='left'>
                      {article.tarifen_broj_ddv}%
                    </TableCell>
                    <TableCell>{article.mkd_proizvod}</TableCell>
                    <TableCell className='px-0' align='left'>
                      {article.cena} MKD
                    </TableCell>
                    <TableCell className='px-0 border-none'>
                      <IconButton onClick={() => onEditArticle(article)}>
                        <EditIcon color='secondary'>edit</EditIcon>
                      </IconButton>
                      <IconButton
                        onClick={(event) => onDeleteArticle(event, article)}
                      >
                        <DeleteIcon color='error'>delete</DeleteIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <TablePagination
            className='px-16'
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={articles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleRowsPerPage}
          />
        </Card>
      )}
      {shouldOpenEditorDialog && (
        <ArticleEditorDialog
          handleClose={handleDialogClose}
          open={shouldOpenEditorDialog}
          article={currentArticle}
        />
      )}
      {shouldOpenDeleteDialog && (
        <ConfirmationDialog
          open={shouldOpenDeleteDialog}
          handleClose={handleDeleteDialogClose}
          onYesClick={() => {}}
          text='Дали сигурно сакате да го избришете артиклот ?'
          article={currentArticle}
        />
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity='success'>
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Articles;

package it.polimi.tiw.controllers;

import java.sql.Date;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringEscapeUtils;

import it.polimi.tiw.beans.User;
import it.polimi.tiw.dao.PlaylistDAO;
import it.polimi.tiw.dao.SongDAO;
import it.polimi.tiw.utils.ConnectionHandler;

@WebServlet("/CreatePlaylistjs")
@MultipartConfig
public class CreatePlaylistjs extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private Connection connection;

	public void init() {
		ServletContext context = getServletContext();

		try {
			connection = ConnectionHandler.getConnection(context);
		} catch (UnavailableException e) {
			e.printStackTrace();
		}
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String title = StringEscapeUtils.escapeJava(request.getParameter("playlistTitle"));
		Date creationDate = new Date(System.currentTimeMillis());
		String[] selectedSongs = request.getParameterValues("selectedSongs");
		String error = "";

		HttpSession s = request.getSession();
		User user = (User) s.getAttribute("currentUser");

		if (title == null || title.isEmpty())
			error += "Title is empty";
		else if (title.length() > 45)
			error += "Title is too long";
		else if (selectedSongs == null || selectedSongs.length == 0)
			error += "Cannot create an empty playlist";

		if (!error.equals("")) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);// Code 400
			response.getWriter().println(error);
			return;
		}

		PlaylistDAO pDao = new PlaylistDAO(connection);
		SongDAO songDAO = new SongDAO(connection);

		try {
			boolean result = pDao.createPlaylist(title, creationDate, user.getIdUser());

			if (result == true) {
				int playlistID = pDao.getLastID();
				// add song to the new playlist
				for (String song : selectedSongs) {
					int songID = songDAO.getSongID(song, user.getIdUser());
					// insert into contains db
					pDao.relateSong(songID, playlistID);
					}

				response.setStatus(HttpServletResponse.SC_OK);// Code 200
			} else {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);// Code 400
				response.getWriter().println("PlayList name already used");
			}
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);// Code 500
			response.getWriter().println("Internal server error, retry later");
		}
	}

	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
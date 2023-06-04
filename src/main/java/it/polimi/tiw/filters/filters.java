package it.polimi.tiw.filters;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


@WebFilter( urlPatterns = {"/CreatePlaylistjs", "/UploadSongjs", "/SaveSorting", "/GetPlaylists", "/GetSongs", "/GetSongsInPlaylist"})
public class filters implements Filter {

	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		System.out.print("Login checker filter executing ...\n");

		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		String loginpath = "login.html";

		HttpSession s = req.getSession();
		if (s.isNew() || s.getAttribute("currentUser") == null) {
			res.setStatus(HttpServletResponse.SC_FORBIDDEN);// Code 403
			res.setHeader("Location", loginpath);
			System.out.print("Login checker FAILED...\n");
			return;
		}

		chain.doFilter(request, response);
	}

	public void destroy() {
		// TODO Auto-generated method stub
	}

}
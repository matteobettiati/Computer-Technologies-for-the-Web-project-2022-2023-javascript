package it.polimi.tiw.utils;

import java.util.ArrayList;

public class FromJsonToArray {
	
	/**
	 * Static method that read a jSon string of number and convert it into an arrayList of integer
	 * @param jSon is the String to be converted
	 * @return an arrayList containing the conversion of the jSon
	 */
	public static ArrayList<Integer> fromJsonToArrayList(String jSon){
		
		ArrayList<Integer> sortedArray = new ArrayList<Integer>();
		int num = 0;
		boolean wasNumber = false;
		boolean invalidNumber = false;
		char charRead = ' ';
		
		//Convert the jSon into an array of integer
		for(int i = 1 ; i < jSon.length() ; i++) {
			//System.out.println("Processing character " + jSon.charAt(i));
			//92 is the "\" character
			if(jSon.charAt(i) == '[' || jSon.charAt(i) == ']' || jSon.charAt(i) == 92 || jSon.charAt(i) == ',' 
									 || jSon.charAt(i) == '"' || jSon.charAt(i) == ' ') {
				if(invalidNumber) {
					System.out.println("Invalid number found");
					//Don't add the number in the array and reset the variables
					num = 0;
					wasNumber = false;
					invalidNumber = false;
				}
				else if(wasNumber) {
					System.out.println("Added number: " + num);
					sortedArray.add(num);
					num = 0;
					wasNumber = false;
				}
				continue;
			}
			charRead = jSon.charAt(i);
			//Check if the char read is a number
			if(charRead < 48 && charRead > 57) {
				invalidNumber = true;
			}
			num = num * 10 + (charRead - 48);
			wasNumber = true;
		}
		return sortedArray;
	}
}
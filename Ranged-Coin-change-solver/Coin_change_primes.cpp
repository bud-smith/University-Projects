#include <iostream>
#include <vector>
#include <fstream>
#include <sstream>
#include <string>
#include <iterator>
#include <chrono>

std::vector<int> sieveofEratosthenes(const int n) { // Generates primes up to n using Sieve of Eratosthenes (includes n in primes vector on return).
	std::vector<int> primes;
	std::vector<int> integers;

	for (int i = 0; i < n; i++) { // Pushes back integers 0 to n.
		integers.push_back(i);
	}

	for (int i = 2; i < sqrt(n); i++) { // Finds all primes from 0 to n using Sieve of Eratosthenes.
		if (integers.at(i) != NULL) {
			for (int j = i * i; j < n; j = j + i) {
				integers.at(j) = NULL;
			}
		}
	}

	for (int i = 0; i < n; i++) { // Assigns prime values from integers to a prime vector.
		if (integers.at(i)) {
			primes.push_back(i);
		}
	}
	integers.clear();

	if (primes.at(primes.size() - 1) != n) { // Pushes back gold number.
		primes.push_back(n);
	}

	return primes;
}

int totalCombinations(const int amount, const int min, const int max, const std::vector<int>& primes, const int primesSize, int numberOfCoins) {
	int numberOfCoins2 = numberOfCoins; // Keeps track of combinations.

	if (primesSize <= 0 && amount > 0) // If size of primes 0, and amount greater than 0.
		return 0;
	else if (amount == 0) { // If amount 0, and in constraint range, return 1, else return 0.
		if (numberOfCoins >= min && numberOfCoins <= max)
			return 1;
		else
			return 0;
	}
	else if (numberOfCoins >= max) // if coins above constraint range, return 0 and leave path.
		return 0;
	else if (amount < 0) // if amount less than 0, return 0.
		return 0;

	numberOfCoins++;

	return totalCombinations(amount, min, max, primes, primesSize - 1, numberOfCoins2) +
		totalCombinations(amount - primes[primesSize - 1], min, max, primes, primesSize, numberOfCoins);
}

int main(const int argc, const char** argv) {
	/*--------------------------------------File IO----------------------------------------------------*/
	std::string inFilePath;

	if (argc < 2) { // If input file path argument not used, asks for input file name (must be in current dir).
		std::cout << "File path not specified in command line arguments.\nEnter input file name (must be in current directory): ";
		std::cin >> inFilePath;
	}
	else { // Else go to file path
		inFilePath = argv[1];
	}

	std::ifstream inFile(inFilePath); // Reads input file.
	if (inFile.fail()) { // Checks if input file is valid.
		std::cerr << "Input file could not be opened.\n";
		inFile.close();
		return EXIT_FAILURE;
	}
	std::ofstream outFile("output.txt"); // Creates and reads output file.
	if (outFile.fail()) { // Checks if output file is valid.
		std::cerr << "Output file could not be opened.\n";
		inFile.close();
		outFile.close();
		return EXIT_FAILURE;
	}

	std::string currentLine;
	std::vector<std::vector<int>> index;
	while (getline(inFile, currentLine)) { // Input file handler.
		std::istringstream buffer(currentLine);
		std::vector<int> line{ (std::istream_iterator<int>(buffer)), std::istream_iterator<int>() };

		if (line.size() == 1) { // Handles ranges if single input from file.
			line.push_back(1);
			line.push_back(line.at(0));
		}
		else if (line.size() == 2) // Handles ranges if double input from file.
			line.push_back(line.at(1));

		index.push_back(line);
	}
	inFile.close(); // Closes input file.
	/*-------------------------------------------------------------------------------------------------*/

	/*----------------------------------------------Algorithms-----------------------------------------*/
	for (auto iter : index) {
		auto startTimer = std::chrono::high_resolution_clock::now(); // Starts the timer.

		for (auto iter2 : iter) // Prints file inputs at iter (index).
			std::cout << iter2 << " ";
		std::cout << "\n";

		std::vector<int> primes = sieveofEratosthenes(iter.at(0)); // Generate primes vector.
		int primesSize = primes.size(); // Size of primes vector
		int combinations = totalCombinations(iter.at(0), iter.at(1), iter.at(2), primes, primesSize, 0); // Calculates the number of ways the coins can be paid.
		std::cout << "Combinations: " << combinations << "\n";
		outFile << combinations << "\n"; // Appends number of ways to the output file.

		auto endTimer = std::chrono::high_resolution_clock::now(); // Ends the timer.
		auto totalTime = std::chrono::duration_cast<std::chrono::duration<double>>(endTimer - startTimer);
		std::cout << "Time elapsed: " << totalTime.count() << "s\n\n"; // Prints time.
	}
	/*-------------------------------------------------------------------------------------------------*/
	outFile.close(); // Closes output file.
}
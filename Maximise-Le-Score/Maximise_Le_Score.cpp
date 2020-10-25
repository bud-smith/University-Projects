#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <iterator>
#include <chrono>

using namespace std;

vector<pair<int, int>> sumOfValuesCalculator(vector<pair<int, int>>& ballValues) { // Calculates sum of values values and returns pair with summed values and original values.
	for (int i = 0; i < ballValues.size(); ++i) {
		int sum = 0;
		while (ballValues.at(i).second != 0) {
			sum = sum + ballValues.at(i).second % 10;
			ballValues.at(i).second = ballValues.at(i).second / 10;
		}
		ballValues.at(i).second = sum;
	}

	return ballValues;
}

vector<pair<int, int>> heapifyBalls(vector<pair<int, int>>& ballValues, const int numberOfBalls, int i) { // Max heap algorithm.
	int largest = i;
	int leftChildIndex = ((2 * i) + 1);
	int rightChildIndex = ((2 * i) + 2);
	pair<int, int> temp;

	if ((leftChildIndex < numberOfBalls)) { // If left exists.
		if (ballValues.at(leftChildIndex).second > ballValues.at(largest).second ||
			(ballValues.at(leftChildIndex).second == ballValues.at(largest).second &&
				ballValues.at(leftChildIndex).first > ballValues.at(largest).first)) { // If left child is greater than its parent.
			largest = leftChildIndex;
		}
	}

	if ((rightChildIndex < numberOfBalls)) {
		if (ballValues.at(rightChildIndex).second > ballValues.at(largest).second ||
			(ballValues.at(rightChildIndex).second == ballValues.at(largest).second &&
				ballValues.at(rightChildIndex).first > ballValues.at(largest).first)) { // If right child is greater than the left child or its parent
			largest = rightChildIndex;
		}
	}

	if (largest != i) { // If node swap is to occur.
		temp = ballValues.at(largest);
		ballValues.at(largest) = ballValues.at(i);
		ballValues.at(i) = temp;
		heapifyBalls(ballValues, numberOfBalls, largest); // Checks the new childs sub-tree to check valididity of max heap of new sub-tree and change if invalid.
	}

	return ballValues;
}

vector<pair<int, int>> popHeap(vector<pair<int, int>>& ballValues, const int i) { // Swaps i with end of tree and pops i, then calls heapify to max heap the tree.
	ballValues.at(i) = ballValues.at(ballValues.size() - 1);
	ballValues.pop_back();
	heapifyBalls(ballValues, ballValues.size(), i);

	return ballValues;
}

pair<long long int, long long int> runTestCase(const int numberOfBalls, const int maxTurns, vector<int>& ballValues, string coinFlip) { // Runs test case.
	vector<pair<int, int>> scottHeap;
	vector<pair<int, int>> rustyHeap;
	long long int scottScore = 0, rustyScore = 0;

	for (int i = 0; i < numberOfBalls; i++) { // Creates Rusty's heap of pairs.
		rustyHeap.emplace_back(ballValues.at(i), ballValues.at(i));
	}

	sumOfValuesCalculator(rustyHeap); // Adds sum of values to Rusty's heap.

	for (int i = 0; i < numberOfBalls; i++) { // Creates Scott's heap of pairs.
		scottHeap.emplace_back(rustyHeap.at(i).second, ballValues.at(i)); // Adds both ball values and summed values to Scott's heap.
	}

	for (int i = (numberOfBalls / 2) - 1; i >= 0; i--) { // Heapifies Scott's and Rusty's heap arrays.
		heapifyBalls(scottHeap, numberOfBalls, i);
		heapifyBalls(rustyHeap, numberOfBalls, i);
	}


	while (!scottHeap.empty() && !rustyHeap.empty()) { // While both prioroty queues aren't empty.
		if (coinFlip == "HEADS") { // Scott's turn.
			for (int i = 0; i < maxTurns; i++) { // Players round takes place.
				if (!scottHeap.empty() && !rustyHeap.empty()) {
					scottScore += scottHeap.at(0).second; // Adds Scott's max value on the heap to his score.
					for (int i = 0; i < rustyHeap.size(); ++i) { // Finds the same value located in Rusty's array.
						if (rustyHeap.at(i).first == scottHeap.at(0).second) {
							popHeap(rustyHeap, i); // Pops from Rusty's heap as to not use that value in the future.
							break;
						}
					}
					popHeap(scottHeap, 0); // Pops from Scott's heap as to not use that value in the future.
				}
			}
			coinFlip = "TAILS"; // Changes coin value for next turn.
		}
		else { // Rusty's turn.
			for (int i = 0; i < maxTurns; i++) { // Players round takes place.
				if (!scottHeap.empty() && !rustyHeap.empty()) {
					for (int i = 0; i < scottHeap.size(); ++i) {
						if (scottHeap.at(i).first == rustyHeap.at(0).second) { // Finds Rusty's tree root value in Scotts's array.
							rustyScore += scottHeap.at(i).second; // Adds Rustys's max value on the heap to his score.
							popHeap(scottHeap, i); // Pops from Scotts's heap as to not use that value in the future.
							break;
						}
					}
					popHeap(rustyHeap, 0); // Pops from Rusty's heap as to not use that value in the future.
				}
			}
			coinFlip = "HEADS"; // Changes coin value for next turn.
		}
	}

	pair<long long int, long long int> totalScore;
	totalScore.first = scottScore;
	totalScore.second = rustyScore;

	return totalScore;
}

int main(const int argc, const char** argv) {
	string inFilePath;

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
	std::ofstream outFile("outputLeScore.txt"); // Creates and reads output file.
	if (outFile.fail()) { // Checks if output file is valid.
		std::cerr << "Output file could not be opened.\n";
		inFile.close();
		outFile.close();
		return EXIT_FAILURE;
	}

	int numberOfTests = 0, count = 0;
	vector<vector<int>> testBallValues;
	vector<int> numberOfBalls, maxTurns, ballValues;
	vector<string> coinFlip;

	std::string currentLine;
	getline(inFile, currentLine);
	numberOfTests = stoi(currentLine);

	while (getline(inFile, currentLine)) {
		if (count % 3 == 0) {
			std::istringstream buffer(currentLine);
			std::vector<int> line{ (std::istream_iterator<int>(buffer)), std::istream_iterator<int>() };
			numberOfBalls.push_back(line.at(0)); // Number of balls
			maxTurns.push_back(line.at(1)); // Maximum turns per round
		}
		else if (count % 3 == 1) {
			std::istringstream buffer(currentLine);
			std::vector<int> line{ (std::istream_iterator<int>(buffer)), std::istream_iterator<int>() };
			for (int i = 0; i < line.size(); ++i) {
				ballValues.push_back(line.at(i)); // Each ball.
			}
			testBallValues.push_back(ballValues); // Array of array of balls.
			ballValues.clear();
		}
		else {
			coinFlip.push_back(currentLine); // Coinflip value.
		}

		count++;
	}
	inFile.close();

	pair<long long int, long long int> totalScore;
	for (int i = 0; i < numberOfTests; i++) {
		auto startTimer = std::chrono::high_resolution_clock::now(); // Starts the timer.

		totalScore = runTestCase(numberOfBalls.at(i), maxTurns.at(i), testBallValues.at(i), coinFlip.at(i)); // Runs test case.

		auto endTimer = std::chrono::high_resolution_clock::now(); // Ends the timer.
		auto totalTime = std::chrono::duration_cast<std::chrono::duration<double>>(endTimer - startTimer);

		cout << "Scott: " << totalScore.first << "\nRusty: " << totalScore.second << "\n";
		std::cout << "Time elapsed: " << totalTime.count() << "s\n\n"; // Prints time.

		outFile << totalScore.first << " " << totalScore.second << "\n"; // Writes to output file.
	}

	outFile.close();
}
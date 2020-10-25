#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <iterator>
#include <queue>
#include <set>
#include <list>
#include <chrono>

using namespace std;

long double calculatePathDistance(vector<vector<pair<int, long double>>>& graph, deque<int>& path) {
	long double distance = 0.0, temp = 0.0;

	for (int i = 0; i < path.size() - 1; i++) {
		temp = distance;
		for (int j = 0; j < graph.at(path.at(i)).size(); j++) {
			if (graph.at(path.at(i)).at(j).first == path.at(i + 1)) {
				distance = distance + graph.at(path.at(i)).at(j).second;
			}
		}
		if (temp == distance) {
			return EXIT_FAILURE; // Returns zero of path is invalid. 
		}
	}

	return distance;
}

deque<int> dijkstra(vector<vector<pair<int, long double>>>& graph, const int sourceNode, const int goalNode) {
	int graphSize = graph.size();

	vector<long double> distance(graphSize, INFINITY); // Keeps track of distance between nodes along the path.
	distance.at(sourceNode) = 0.0;

	vector<int> previous(graphSize, -1); // For keeping track of where any current nodes previous node is in the graph.

	set<pair<long double, int>> q; // Set acting as a queue.
	q.insert(make_pair(distance.at(sourceNode), sourceNode)); // Insert source node the queue.

	while (!q.empty()) {
		long double dist = q.begin()->first; // Current distance = front of queues current distance
		int u = q.begin()->second; // u is the current nodes index in the graph.
		q.erase(q.begin()); // pop from top of queue

		for (int i = 0; i < graph.at(u).size(); i++) { // For all adjacent nodes to current node.
			int v = graph.at(u).at(i).first; // v is the node a ith index in current nodes adjacency list
			long double weight = graph.at(u).at(i).second; // weight is the distance from current node to v node
			long double alt = dist + weight; // alt is the weight from current node to next node.

			if (alt < distance.at(v)) { // If alt is less than the known distance at next node v.
				distance.at(v) = alt; // Assigns distance from current node to next node.
				previous.at(v) = u; // Assigns the previous node to the current.
				q.insert(make_pair(distance.at(v), v)); // Adds next node to the queue.
			}
		}
	}

	deque<int> path;
	for (int i = goalNode; i != -1; i = previous.at(i)) { // Finds path from source to goal using the 'previous' vector.
		path.push_front(i);
	}

	return path;
}

vector<long double> yens(vector<vector<pair<int, long double>>>& graph, deque<int>& path, const int sourceNode, const int goalNode, const int K) {
	vector<vector<pair<int, long double>>> newGraph = graph;

	vector<deque<int>> a; // List of shortest paths.

	priority_queue<pair<long double, deque<int>>,
		vector<pair<long double, deque<int>>>,
		greater<pair<long double, deque<int>>>> b; // Minimum priority queue of pairs of distance and path. Sorting by distance of path.

	a.push_back(path);
	vector<long double> aDistance;
	aDistance.push_back(calculatePathDistance(graph, a.at(0))); // Adds shortest path to k-shortest paths.

	int spurNode = 0, removeIndex = 0;
	deque<int> rootPath, spurPath, totalPath, p, pTemp;

	for (int k = 1; k < K; k++) {
		for (int i = 0; i < a.at(k - 1).size() - 2; ++i) {
			spurNode = a.at(k - 1).at(i);
			for (int j = 0; j <= i; j++) { // Creates root path.
				rootPath.push_back(a.at(k - 1).at(j));
			}

			for (int j = 0; j < a.size(); j++) { // removes edges to next node from previous path that are in the in root path.
				p = a.at(k - 1);
				for (int m = 0; m <= i; m++) { // Previous path up to i.
					pTemp.push_back(a.at(k - 1).at(m));
				}

				if (rootPath == pTemp && p.size() > 0 && rootPath.size() > 0) { // Removes link from spur node to previous path next node.
					for (int n = 0; n < newGraph.at(p.at(i)).size(); n++) {
						if (newGraph.at(p.at(i)).at(n).first == p.at(i + 1)) {
							newGraph.at(p.at(i)).erase(newGraph.at(p.at(i)).begin() + n);
							break;
						}
					}
					for (int n = 0; n < newGraph.at(p.at(i + 1)).size(); n++) { // Removes link from previous paths next node to spur node.
						if (newGraph.at(p.at(i + 1)).at(n).first == p.at(i)) {
							newGraph.at(p.at(i + 1)).erase(newGraph.at(p.at(i + 1)).begin() + n);
							break;
						}
					}
				}
				pTemp.clear();
			}

			for (int q = 0; q < rootPath.size(); q++) { // Removes root path nodes from graph, exept spur node.
				if (rootPath.at(q) == spurNode) {
					continue;
				}

				for (auto iter : newGraph.at(rootPath.at(q))) { // Removes links from all nodes connected to current root node in graph.
					for (int n = 0; n < newGraph.at(iter.first).size(); n++) {
						if (newGraph.at(iter.first).at(n).first == rootPath.at(q)) {
							newGraph.at(iter.first).erase(newGraph.at(iter.first).begin() + n);
							break;
						}
					}
				}

				for (int i = 0; i < newGraph.at(rootPath.at(q)).size(); i++) { // Removes links from current root node to connected nodes in graph.
					newGraph.at(rootPath.at(q)).erase(newGraph.at(rootPath.at(q)).begin() + i);
				}
			}

			spurPath = dijkstra(newGraph, spurNode, goalNode); // Finds path from spur node to goal node using dijkstra.

			totalPath = rootPath;
			rootPath.clear();

			for (int i = 0; i < totalPath.size(); i++) { // Removes spur node from total path
				if (totalPath.at(i) == spurNode) {
					totalPath.erase(totalPath.begin() + i);
					break;
				}
			}

			totalPath.insert(totalPath.end(), spurPath.begin(), spurPath.end()); // Concatenates root path and spur path to get a complete path.

			long double distance = calculatePathDistance(graph, totalPath); // Calculates the total paths distance from source to goal.

			if (distance > aDistance.at(0)) { // pushes to queue if total path is a valid path.
				b.push(make_pair(distance, totalPath));
			}
		}
		newGraph = graph;
		for (int i = 0; i < K; i++) { // Removes duplicate paths from queue.
			for (int j = 0; j < a.size(); j++) {
				if (b.top().first == aDistance.at(j) && b.top().second == a.at(j)) {
					b.pop();
					break;
				}
			}
		}

		a.push_back(b.top().second); // Adds next shortest path to 'a' paths.
		aDistance.push_back(b.top().first); // Adds next shortest paths distance to 'aDistance' vector.
		b.pop(); // Removes shortest path from queue.
	}

	return aDistance;
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

	ifstream inFile(inFilePath); // Reads input file.
	if (inFile.fail()) { // Checks if input file is valid.
		cerr << "Input file could not be opened.\n";
		inFile.close();
		return EXIT_FAILURE;
	}
	ofstream outFile("output.txt"); // Creates and reads output file.
	if (outFile.fail()) { // Checks if output file is valid.
		cerr << "Output file could not be opened.\n";
		inFile.close();
		outFile.close();
		return EXIT_FAILURE;
	}

	int n = 0, m = 0, sourceNode = 0, goalNode = 0, k = 0, max = -1;
	vector<vector<pair<int, long double>>> graph;
	vector<pair<int, long double>> currentIndex;
	pair<int, long double> nodePair;

	string currentLine;

	getline(inFile, currentLine);
	istringstream buffer(currentLine);
	vector<int> line{ (istream_iterator<int>(buffer)), istream_iterator<int>() };
	n = line.at(0);
	m = line.at(1);

	while (getline(inFile, currentLine)) {
		istringstream buffer(currentLine);
		vector<long double> line{ (istream_iterator<long double>(buffer)),istream_iterator<long double>() };

		if (inFile.peek() == EOF) { // Last line in file
			sourceNode = line.at(0);
			goalNode = line.at(1);
			k = line.at(2);
		}
		else if (line.at(0) > max) { // Pushes nodes to graph
			if (line.at(0) >= graph.size()) {
				for (int i = graph.size(); i < line.at(0); i++) {
					graph.push_back(currentIndex);
					graph.back().push_back(nodePair);
				}
			}
			graph.push_back(currentIndex);
			graph.back().push_back(nodePair);
			graph.back().back().first = line.at(1);
			graph.back().back().second = line.at(2);

			max = line.at(0);
		}
		else if (line.at(0) <= max) { // Pushes links to nodes in graph.
			graph.at(line.at(0)).push_back(nodePair);
			graph.at(line.at(0)).back().first = line.at(1);
			graph.at(line.at(0)).back().second = line.at(2);
		}
	}
	inFile.close();

	deque<int> path = dijkstra(graph, sourceNode, goalNode);

	auto startTimer = std::chrono::high_resolution_clock::now(); // Starts the timer.

	cout << "Enter K number of paths to find:";
	cin >> k;

	vector<long double> kShortest = yens(graph, path, sourceNode, goalNode, k);

	auto endTimer = std::chrono::high_resolution_clock::now(); // Ends the timer.
	auto totalTime = std::chrono::duration_cast<std::chrono::duration<double>>(endTimer - startTimer);

	cout.precision(10);
	for (int i = 0; i < kShortest.size(); i++) {
		cout << i + 1 << ": " << kShortest.at(i) << "\n";
		outFile << kShortest.at(i) << "\n";
	}

	std::cout << "\nTime elapsed: " << totalTime.count() << "s"; // Prints time.

	outFile.close();
}
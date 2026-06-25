#include <iostream>
#include <string>
using namespace std;

int main() {
    string properties[5] = {
        "2BHK Flat",
        "3BHK House",
        "Villa",
        "Apartment",
        "Farm House"
    };

    string search;
    cout << "Enter Property Name: ";
    getline(cin, search);

    bool found = false;

    for(int i = 0; i < 5; i++) {
        if(properties[i] == search) {
            found = true;
            break;
        }
    }

    if(found)
        cout << "Property Found";
    else
        cout << "Property Not Found";

    return 0;
}
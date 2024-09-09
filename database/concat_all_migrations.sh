#!/bin/bash

# Output file name
output_file="concatenated_migrations.sql"

# Migrations folder path
migrations_folder="/Users/yesset/Desktop/rama/intranet-tourism-rama/database/migrations"

# Create an empty output file
> "$output_file"

# Loop through each file in the migrations folder
for file in "$migrations_folder"/*; do
    # Check if the file is a regular file
    if [ -f "$file" ]; then
        # Add file name as a comment in the output file
        echo "-- File: $(basename "$file")" >> "$output_file"

        # Append the content of the file to the output file
        cat "$file" >> "$output_file"

        # Add a separator between files
        echo >> "$output_file"
    fi
done

echo "Concatenation completed. Output file: $output_file"

const Discord = require('discord.js')
const client = new Discord.Client()
const botSetting = require('./botsetting.json')

//auxiliary function
function outline(x){
    return "\`\`\`" + x + "\`\`\`";
}
function ml(x){
    return "ml\n" + x;
}
function darkGreen(x){
    return "bash\n \"" + x + "\"";
}
let committeeMember;
let ambassadors;
let VoiceChannel;
let AbsentMember;
let roleOfMeeting = "";
let isMeeting = false;
client.on('ready' , ()=> {
    console.log("Connected as: " + client.user.tag)
    client.user.setActivity('Hamilton', { type: 'WATCHING' });
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`); 
    
    // The following line fetches only the Warbler server
    const currentGuild = client.guilds.resolve("724061934684602428");
    const allMember = currentGuild.members.cache;
   //get a list of all committee member
   function getMemberFromTag(tag){return allMember.filter(member => member.roles.cache.find(role => role.name == tag) != undefined);}
    
    committeeMember = getMemberFromTag("Committee");
    ambassadors = getMemberFromTag("Ambassador");
    allVoiceChannel = currentGuild.channels.cache.filter(channel => channel.type == "voice");
    let output = "";
    botChannel = currentGuild.channels.cache.find( channel => channel.name == "bot");
    RandomChannel = currentGuild.channels.cache.find( channel => channel.name == "random");
    //RandomChannel.send("shut up");
    AbsentMember = currentGuild.members.cache.filter(member => member.id == 0)
    //console.log(allMember.filter(member => member.roles.cache.find(role => role.name == "Committee") != undefined));
})



client.on('message', async msg => {
    Guild = msg.guild;
    const prefix = msg.content[0];
    const command = msg.content.substring(1, msg.content.length);
    const currentGuild = msg.guild;   
    const allMember = currentGuild.members.cache;
    const botChannel = currentGuild.channels.cache.find( channel => channel.name == "bot");

    function getMemberFromTag(tag){return allMember.filter(member => member.roles.cache.find(role => role.name == tag) != undefined);}
    if(prefix == botSetting.prefix)
    {   if(msg.author.bot) return;
        //console.log(allMember)

        function memberList(member){
            let output = "";
            member.each( member => { 
                if (member.nickname != undefined)
                    output += `"${member.nickname}"\n`;
                else
                    output += `"${member.user.username}"\n`;
                })
            botChannel.send(outline(ml(`members are:\n${output}`)));
        }
        function getUsername(userMember){
            if(userMember.nickname != null)
                return userMember.nickname;
            else
                return userMember.user.username;
        }

        if(command.split(' ')[0] == "absent")
            {//create an empty collection
            isMeeting = true;
            output = "";
            vChannel = ""
            if(command == 'absent')
                memTag = null
            else if(command.split(' ')[1][0] == "[")
                {
                
                for(i = 0; i<command.split(' ').length; i++)
                    { tempC = command.split(' ')
                    
                    if(tempC[i][0] == "[")
                       { 
                        if(tempC[i][tempC[i].length - 1] == ']')
                            {vChannel = tempC[i].substring(1, tempC[i].length - 1);
                                memTag = tempC.splice(i + 1).join(' ');
                            break;}
                        vChannel = vChannel + tempC[i].substring(1, tempC[i].length) + " ";}
                    else if(tempC[i][tempC[i].length - 1] == "]")
                        {
                        vChannel += tempC[i].substring(0, tempC[i].length - 1);
                        memTag = tempC.splice(i + 1).join(' ');}
                    }
                //memTag = command.split(' ').splice(2).join(" ");
                }
            else
                memTag = command.split(' ').splice(1).join(" ");

             
            activeChannel = allVoiceChannel.find(channel => channel.members.array().length != 0);
            
            if(vChannel != "")
                activeChannel = allVoiceChannel.find(channel => channel.name == vChannel);
            if(memTag == null)
                allMemberSupposeToHere = allMember;
            else
                allMemberSupposeToHere = getMemberFromTag(memTag);
            
            roleOfMeeting = command.split(' ').splice(1).join(" ");
            AbsentMember = allMemberSupposeToHere.filter(member => activeChannel.members.get(member.id) == undefined);
            
            if(activeChannel != null){    
                AbsentMember.each(member => {
                    
                    output = output + ` ${getUsername(member)}\n`
                })
            botChannel.send(outline(ml( `meeting active in ${activeChannel.name}:\n` + `ones not present with tag ${memTag} are:\n` + output)));
        }
        else
            botChannel.send(outline(ml("no voice chat active")));
        
    }
        else if(command == "spam")
        {//activeChannel = allVoiceChannel.find(channel => channel.members.array().length != 0);
            if(isMeeting == false)
                {botChannel.send(outline(ml("Meeting not started")));}
            else if(AbsentMember.array().length == 0)
                {botChannel.send(outline(ml("All members are here")))}
            else 
                {output = "";
                    AbsentMember.each( member => {
                    output = output + `<@${member.id}>\n`;
                })
                botChannel.send(outline(ml("Tagging \"members\" not here:")) + "\n" + output);
            }


        }
        else if(command.split(' ')[0] == "present")
        {output = "";
        vChannel = "";
        let arg ="";
        if(command == "present")
            arg = ""
        else if(command.split(' ')[1][0] == "[")
                {
                
                for(i = 0; i<command.split(' ').length; i++)
                    { tempC = command.split(' ')
                    
                    if(tempC[i][0] == "[")
                       { 
                        if(tempC[i][tempC[i].length - 1] == ']')
                            {vChannel = tempC[i].substring(1, tempC[i].length - 1);
                                arg = tempC.splice(i + 1).join(' ');
                            break;}
                        vChannel = vChannel + tempC[i].substring(1, tempC[i].length) + " ";}
                    else if(tempC[i][tempC[i].length - 1] == "]")
                        {
                        vChannel += tempC[i].substring(0, tempC[i].length - 1);
                        arg = tempC.splice(i + 1).join(' ');}
                    }
                //memTag = command.split(' ').splice(2).join(" ");
                }
            else
                arg = command.split(' ').splice(1).join(" ");
        
        if(vChannel == "")
            activeChannel = allVoiceChannel.find(channel => channel.members.array().length != 0);
        else
                activeChannel = allVoiceChannel.find(channel => channel.name == vChannel);
        let roleSpecific;
        if(arg == "")
            {roleSpecific = activeChannel.members; output += `All Member present in \"${activeChannel.name}\" are:\n`;}
        else 
            {roleSpecific = activeChannel.members.filter(member => member.roles.cache.find(role => role.name == arg) != undefined);
                output += `All Member present in \"${activeChannel.name}\" with tag ${arg} are:\n`;}
        roleSpecific.each(member => {
            output = output + `${getUsername(member)}\n`;
        })
        botChannel.send(outline(ml(output)));
    
        }
        //return basic imformation about the server
        else if(command =="can i buy you a drink?")
        {msg.channel.send("that would be nice :)");
        msg.channel.send("*while we’re talking, let me offer you some free advice. shut up. just shut the fuck up*");}
        else if(command == "server")
            {  
                msg.channel.send(outline(ml(`server name: ${Guild.name}\nserver size: ${Guild.memberCount}\n server owner: ${Guild.owner.nickname}`)));
                }

        else if(command == "committee")
                {
                memberList(committeeMember);
                }
        
        else if(command == "ambassador")
                {
                memberList(ambassadors);
                }
        else if(command.split(' ')[0] == "department")
                { title = command.split(' ').splice(1).join(" ");
                const department = getMemberFromTag(title);
                if (currentGuild.roles.cache.find( role => role.name == title) != undefined)
                    {memberList(department); }   
                }
        // this command check if the voice channel exist
        else if(command.split(' ')[0] == "connected-to?")
            {output = "";
                channelName = command.split(' ').splice(1).join(' ');
            VoiceChannel = Guild.channels.cache.find(channel => channel.name == channelName)//.members;//637461747669925909
            VoiceChannel.members.each(member => {
                
                output = output + `${getUsername(member)}\n`;
            })
            botChannel.send(outline(ml(`Members connected to ${channelName} are:\n${output}`)))
        }
        
        
    }
 })
 client.on('voiceStateUpdate', async (oldMember, newMember) => {
     
     const currentGuild = oldMember.guild;
    let newUserChannel = newMember.channel;
    let oldUserChannel = oldMember.channel;
    msgChannel = currentGuild.channels.cache.find( channel => channel.name == "bot");
    function getUsername(userMember){
        if(userMember.nickname != null)
            return userMember.nickname;
        else
            return userMember.user.username;
    }
    if(oldUserChannel === null && newUserChannel !== null)
        {msgChannel.send(outline(ml(`User "${getUsername(newMember.member)}" joined`)));}
    else if(newUserChannel === null)
        {msgChannel.send(outline(ml(`User "${getUsername(newMember.member)}" left`)));}
 })

client.login(botSetting.token)
